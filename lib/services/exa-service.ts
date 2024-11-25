import Exa from "exa-js";

// Initialize Exa client with API key from environment variables
const API_KEY = process.env.EXA_API_KEY;

if (!API_KEY) {
  console.error('Exa API key is missing. Please check your .env.local file for EXA_API_KEY.');
}

let exa: Exa | null = null;

try {
  exa = new Exa(API_KEY);
} catch (error) {
  console.error('Error initializing Exa client:', error);
}

/**
 * Lists of domains to exclude or handle specially when searching for company URLs.
 * Separated into two categories:
 * 1. Major social media and tech platforms (always excluded)
 * 2. Other platforms that get scoring penalties but aren't excluded
 */
const socialMediaAndMajorTech = [
  'facebook.com', 'linkedin.com', 'twitter.com', 'instagram.com',
  'pinterest.com', 'youtube.com', 'tiktok.com', 'snapchat.com',
  'reddit.com', 'tumblr.com', 'medium.com', 'quora.com',
  'google.com', 'apple.com', 'microsoft.com', 'crunchbase.com',
  'glassdoor.com', 'wikipedia.org', 'pitchbook.com', 'trustpilot.com',
  'techcrunch.com', 'yahoo.com', 'yelp.com'
];

// Other platforms and services
const otherPlatforms = [
  'g2.com', 'github.com', 'gitlab.com', 'bitbucket.org', 'thinkific.com',
  'teachable.com', 'udemy.com', 'coursera.org', 'edx.org',
  'skillshare.com', 'pluralsight.com', 'lynda.com',
  'angel.co', 'producthunt.com', 'ycombinator.com',
  'indeed.com', 'monster.com', 'ziprecruiter.com', 'wix.com',
  'squarespace.com', 'wordpress.com', 'blogspot.com', 'substack.com',
  'patreon.com', 'gofundme.com', 'kickstarter.com', 'indiegogo.com',
  'signal.nfx.com', 'vercel.app', 'herokuapp.com',
  'github.io', 'netlify.app', 'web.app', 'firebaseapp.com',
  'azurewebsites.net', 'cloudfront.net', 'amazonaws.com',
  'digitaloceanspaces.com', 'googleusercontent.com', 'pages.dev',
  'surge.sh', 'now.sh', 'workers.dev', 'repl.co', 'glitch.me',
  'render.com', 'onrender.com', 'appspot.com', 'fly.dev', 'deno.dev',
  'cyclic.app', 'beanstalkapp.com', 'pythonanywhere.com', 'streamlit.app',
  'azureedge.net', 'cloudflare.net', 'ngrok.io', 'pantheonsite.io',
  'wpengine.com', 'myshopify.com', 'wixsite.com', 'webflow.io',
  'prismic.io', 'contentful.com', 'ghost.io', 'gatsbyjs.io',
  'nextjs.org', 'svelte.dev', 'nuxtjs.org', 'amazon.com', 'capterra.com',
  'investopedia.com', 'coinmarketcap.com', 'cbinsights.com', 'businessinsider.com',
  'tracxn.com', 'forbes.com', 'wiktionary.org', 'vimeo.com', 'cbnews.com', 
  'zoominfo.com', 'fortune.com', 'cnbc.com', 'theatlantic.com'
];

/**
 * Searches for a company's official website using Exa API.
 * Returns both a primary and secondary URL, prioritizing official company domains
 * over platform/marketplace URLs.
 * 
 * @param companyName - Name of the company to search for
 * @returns Object containing primary and secondary URLs (as origins only)
 */
export async function searchCompanyUrl(companyName: string): Promise<{ primaryUrl: string | null, secondaryUrl: string | null }> {
  if (!API_KEY || !exa) {
    console.error('Exa API key is missing or Exa client is not initialized. Unable to perform search.');
    return { primaryUrl: null, secondaryUrl: null };
  }

  try {
    console.log(`Searching for company: ${companyName}`);

    const result = await exa.search(
      `${companyName}`,
      {
        type: "keyword",
        numResults: 5,
        excludeDomains: socialMediaAndMajorTech,
      }
    );

    console.log(`Received response from Exa API. Total results: ${result.results.length}`);

    if (!result.results || result.results.length === 0) {
      console.log('No results found in API response');
      return { primaryUrl: null, secondaryUrl: null };
    }

    let bestUrl: string | null = null;
    let secondBestUrl: string | null = null;
    let bestScore = -Infinity;
    let secondBestScore = -Infinity;

    console.log(`Scoring URLs for ${companyName}:`);
    let urlScores: { url: string, lcsScore: number, totalScore: number }[] = [];

    for (let i = 0; i < result.results.length; i++) {
      const item = result.results[i];
      if (item.url) {
        try {
          const { lcsScore, totalScore } = isLikelyOfficialWebsite(item, companyName);
          
          // Add bonus score for the first result
          const firstPlaceBonus = i === 0 ? 50 : 0;
          
          // Penalize URLs from otherPlatforms
          const domain = new URL(item.url).hostname;
          if (otherPlatforms.some(platform => domain.includes(platform))) {
            const penalizedScore = totalScore - 100 + firstPlaceBonus; // Heavy penalty + first place bonus
            console.log(`Result ${i + 1}: LCS Score ${lcsScore}, Total Score ${penalizedScore} (penalized${firstPlaceBonus ? ' + first place bonus' : ''}) for ${item.url}`);
            urlScores.push({ url: item.url, lcsScore, totalScore: penalizedScore });
            if (penalizedScore > bestScore) {
              secondBestUrl = bestUrl;
              secondBestScore = bestScore;
              bestUrl = item.url;
              bestScore = penalizedScore;
            } else if (penalizedScore > secondBestScore) {
              secondBestUrl = item.url;
              secondBestScore = penalizedScore;
            }
          } else {
            const finalScore = totalScore + firstPlaceBonus;
            console.log(`Result ${i + 1}: LCS Score ${lcsScore}, Total Score ${finalScore}${firstPlaceBonus ? ' (with first place bonus)' : ''} for ${item.url}`);
            urlScores.push({ url: item.url, lcsScore, totalScore: finalScore });
            if (finalScore > bestScore) {
              secondBestUrl = bestUrl;
              secondBestScore = bestScore;
              bestUrl = item.url;
              bestScore = finalScore;
            } else if (finalScore > secondBestScore) {
              secondBestUrl = item.url;
              secondBestScore = finalScore;
            }
          }
        } catch (error) {
          console.error(`Error scoring URL ${item.url}:`, error);
        }
      }
    }

    if (bestUrl && bestScore > 0) {
      const primaryDomain = new URL(bestUrl).origin;
      const secondaryDomain = secondBestUrl ? new URL(secondBestUrl).origin : null;
      
      console.log(`Found likely official URL: ${bestUrl} with score ${bestScore}`);
      // Truncate the URL to just the domain
      
      // Updated summary log
      console.log("\nURL Scoring Summary:");
      urlScores.forEach(({ url, lcsScore, totalScore }) => {
        console.log(`${url} - LCS Score: ${lcsScore}, Total Score: ${totalScore}`);
      });
      
      return { primaryUrl: primaryDomain, secondaryUrl: secondaryDomain };
    }

    console.log('No suitable URL found in the results');
    
    // Updated summary log when no suitable URL is found
    console.log("\nURL Scoring Summary:");
    urlScores.forEach(({ url, lcsScore, totalScore }) => {
      console.log(`${url} - LCS Score: ${lcsScore}, Total Score: ${totalScore}`);
    });
    
    return { primaryUrl: null, secondaryUrl: null };
  } catch (error) {
    console.error('Error searching company URL:', error);
    return { primaryUrl: null, secondaryUrl: null };
  }
}

/**
 * Scores a URL based on how likely it is to be a company's official website.
 * Scoring factors include:
 * - Longest common subsequence match between company name and domain
 * - Domain structure (subdomains, TLD)
 * - Exact matches and partial matches of company name
 * 
 * @param doc - Document from Exa API containing URL and domain info
 * @param companyName - Name of company to match against
 * @returns Object with both LCS score and total weighted score
 */
function isLikelyOfficialWebsite(doc: any, companyName: string): { lcsScore: number, totalScore: number } {
  const url = doc.url?.toLowerCase() || '';
  let domain = doc.domain?.toLowerCase() || '';

  // If domain is empty, try to extract it from the URL
  if (!domain && url) {
    try {
      const urlObject = new URL(url);
      domain = urlObject.hostname;
    } catch (error) {
      console.error(`Error parsing URL: ${url}`);
    }
  }

  const company = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');

  let score = 0;
  let logMessage = `Scoring ${url}:\n`;

  console.log(`Original URL: ${url}`);
  console.log(`Extracted domain: ${domain}`);

  // Normalize domain: remove TLD, 'www', and non-alphanumeric characters
  const normalizedDomain = domain.split('.').slice(0, -1).join('')
    .replace(/^www/, '').replace(/[^a-z0-9]/g, '');
  
  console.log(`Normalized company: ${company}`);
  console.log(`Normalized domain: ${normalizedDomain}`);

  let lcsScore = 0;
  if (normalizedDomain) {
    const lcsLength = longestCommonSubsequence(company, normalizedDomain);
    lcsScore = Math.round((lcsLength / Math.max(company.length, normalizedDomain.length)) * 100);
    
    score += lcsScore;
    logMessage += `  +${lcsScore}: LCS match score\n`;

    console.log(`LCS score: ${lcsScore}`);
  } else {
    console.log("No valid domain found for matching");
  }

  // Parse the URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
  } catch (error) {
    console.error(`Invalid URL: ${url}`);
    return { lcsScore: -Infinity, totalScore: -Infinity }; // Return a very low score for invalid URLs
  }

  const domainParts = parsedUrl.hostname.split('.');

  // List of common official TLDs
  const officialTLDs = [
    'com', 'co', 'net', 'org', 'vc',
    'io', 'ai', 'app', 'dev', 'software', 
    'health', 'med', 'healthcare', 'care', 'clinic', 
    'finance', 'inc', 'business', 'insurance', 'bank', 
    'law', 'legal', 'attorney', 
    'design', 'art', 'agency', 
    'edu', 'academy', 
    'xyz', 'global', 'company', 'solutions', 'systems', 
    'ventures', 'digital', 'online', 'site', 'space', 'life'
  ];

  // Penalize non-official TLDs
  const currentTld = domainParts[domainParts.length - 1];
  
  // Exact match of company name in domain
  if (officialTLDs.some(tld => domain === `${company}.${tld}` || domain === `www.${company}.${tld}`)) {
    score += 110;
    logMessage += "  +110: Exact match of company name with official TLD\n";
  } else if (domainParts[domainParts.length - 2] === company) {
    score += 80;
    logMessage += "  +80: Company name is the main part of the domain\n";
  } else if (domain.startsWith(`${company}.`)) {
    score += 70;
    logMessage += "  +70: Domain starts with exact company name\n";
  } else if (domain.includes(company)) {
    score += 40;
    logMessage += "  +40: Company name included in domain\n";
  }

  // Modified subdomain handling
  const whitelistedSubdomains = ['www', 'my'];
  if (domainParts.length > 2) {
    if (!whitelistedSubdomains.includes(domainParts[0])) {
      score -= 25;
      logMessage += "  -50: Subdomain (not whitelisted)\n";
    }
  }

  // Prioritize common TLDs
  if (officialTLDs.includes(currentTld)) {
    score += 7;
    logMessage += `  +7: .${currentTld} TLD\n`;
  }

  console.log(`Current total score: ${score}`);

  logMessage += `  Total score: ${score}`;
  console.log(logMessage);

  // Return both LCS score and total score
  return { lcsScore, totalScore: score };
}

/**
 * Calculates the length of the longest common subsequence between two strings.
 * Used for fuzzy matching company names with domain names.
 * 
 * @param str1 - First string to compare
 * @param str2 - Second string to compare
 * @returns Length of the longest common subsequence
 */
function longestCommonSubsequence(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Enriches company data by analyzing their website content.
 * Extracts key business information including:
 * - Value proposition
 * - Business model (B2B/B2C)
 * - Industry and target markets
 * - Ideal Customer Profile (ICP)
 * 
 * @param url - Company website URL to analyze
 * @returns Formatted string with company insights or null if analysis fails
 */
export async function enrichCompanyData(url: string): Promise<{ industry?: string, valueProp?: string } | null> {
  if (!API_KEY || !exa) {
    console.error('Exa API key is missing or Exa client is not initialized.');
    return null;
  }

  try {
    console.log(`[Exa Enrichment] Starting enrichment for URL: ${url}`);

    const result = await exa.getContents(
      [url],
      {
        text: true,
        summary: {
          query: "Return only:\n1. Value proposition in 1 sentence\n2. Industry\n\nProvide only these two answers, one per line, without any additional text or labels."
        }
      }
    );

    console.log('[Exa Enrichment] Raw API response:', JSON.stringify(result, null, 2));

    // Type guard to ensure result is an array
    if (!Array.isArray(result)) {
      console.log('[Exa Enrichment] Result is not an array');
      return null;
    }

    // Check if we have any results and if the first result has a summary
    const firstResult = result[0];
    if (!firstResult || typeof firstResult.summary !== 'string') {
      console.log('[Exa Enrichment] No valid summary found in first result');
      return null;
    }

    const summary = firstResult.summary;
    console.log('[Exa Enrichment] Summary found:', summary);
    
    const [valueProp, industry] = summary.split('\n').map((line: string) => line.trim());
    console.log('[Exa Enrichment] Parsed values:', { valueProp, industry });
    
    return {
      valueProp: valueProp || undefined,
      industry: industry || undefined
    };

  } catch (error) {
    console.error('[Exa Enrichment] Error:', error);
    if (error instanceof Error) {
      console.error('[Exa Enrichment] Error details:', error.message, error.stack);
    }
    return null;
  }
}

/**
 * Extracts company name from a given website URL using content analysis.
 * 
 * @param url - Website URL to analyze
 * @returns Company name or null if extraction fails
 */
export async function getCompanyName(url: string): Promise<string | null> {
  if (!API_KEY || !exa) {
    console.error('Exa API key is missing or Exa client is not initialized. Unable to get company name.');
    return null;
  }

  try {
    console.log(`Getting company name for URL: ${url}`);

    const result = await exa.searchAndContents(
      url,
      {
        type: "keyword",
        numResults: 1,
        summary: {
          query: "Get a company name. Format of output: {company_name}. Nothing else."
        }
      }
    ) as { results?: Array<{ summary?: string }> };

    console.log('Raw result from Exa:', JSON.stringify(result, null, 2));

    if (result.results && result.results.length > 0 && result.results[0].summary) {
      const summary = result.results[0].summary;
      console.log('Summary found:', summary);
      // Extract company name from {company_name} format
      const match = summary.match(/\{(.+?)\}/);
      if (match) {
        return match[1];
      }
    }

    console.log('No company name found in result');
    return null;
  } catch (error) {
    console.error('Error getting company name:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return null;
  }
}

/**
 * Searches for a company's LinkedIn profile pages.
 * Returns primary and secondary LinkedIn URLs, plus all found results with scores.
 * Scoring prioritizes:
 * - Official company page URLs (/company/ paths)
 * - Name matches between company and LinkedIn profile
 * - Main linkedin.com domain over subdomains
 * 
 * @param companyName - Name of company to search for
 * @returns Object containing primary, secondary URLs and all scored results
 */
export async function searchCompanyLinkedIn(companyName: string): Promise<{ primary: string | null, secondary: string | null, allResults: Array<{url: string, score: number}> }> {
  if (!API_KEY || !exa) {
    console.error('Exa API key is missing or Exa client is not initialized. Unable to perform LinkedIn search.');
    return { primary: null, secondary: null, allResults: [] };
  }

  try {
    console.log(`Searching for LinkedIn page of company: ${companyName}`);

    const result = await exa.search(
      `${companyName} company LinkedIn`,
      {
        type: "keyword",
        numResults: 10,
        includeDomains: ["linkedin.com"],
        includeText: ["/company/"]
      }
    );

    console.log(`Received response from Exa API for LinkedIn search. Total results: ${result.results.length}`);

    if (!result.results || result.results.length === 0) {
      console.log('No LinkedIn results found in API response');
      return { primary: null, secondary: null, allResults: [] };
    }

    let primaryUrl: string | null = null;
    let secondaryUrl: string | null = null;
    let primaryScore = -Infinity;
    let secondaryScore = -Infinity;
    let allResults: Array<{url: string, score: number}> = [];

    for (const item of result.results) {
      console.log(`Processing result: ${item.url}`);
      if (item.url && item.url.includes('linkedin.com/company/')) {
        const score = calculateLinkedInScore(item.url, companyName);
        allResults.push({url: item.url, score});
        if (score > primaryScore) {
          secondaryUrl = primaryUrl;
          secondaryScore = primaryScore;
          primaryUrl = item.url;
          primaryScore = score;
        } else if (score > secondaryScore) {
          secondaryUrl = item.url;
          secondaryScore = score;
        }
      } else {
        console.log(`Skipping non-company LinkedIn URL: ${item.url}`);
      }
    }

    console.log(`All LinkedIn results:`, allResults);
    console.log(`Found primary LinkedIn URL: ${primaryUrl} with score ${primaryScore}`);
    console.log(`Found secondary LinkedIn URL: ${secondaryUrl} with score ${secondaryScore}`);

    // Clean the URLs before returning
    const cleanPrimaryUrl = primaryUrl ? cleanLinkedInUrl(primaryUrl) : null;
    const cleanSecondaryUrl = secondaryUrl ? cleanLinkedInUrl(secondaryUrl) : null;

    return { primary: cleanPrimaryUrl, secondary: cleanSecondaryUrl, allResults };
  } catch (error) {
    console.error('Error searching company LinkedIn URL:', error);
    return { primary: null, secondary: null, allResults: [] };
  }
}

/**
 * Scores a LinkedIn URL based on how well it matches the company name
 * and URL structure quality.
 * 
 * @param url - LinkedIn URL to score
 * @param companyName - Company name to match against
 * @returns Numerical score indicating match quality
 */
function calculateLinkedInScore(url: string, companyName: string): number {
  const urlParts = new URL(url);
  const pathSegments = urlParts.pathname.split('/').filter(segment => segment.length > 0);
  const linkedInCompanyName = pathSegments[pathSegments.length - 1]?.toLowerCase().replace(/-/g, '') || '';
  const normalizedCompanyName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');

  const lcsLength = longestCommonSubsequence(normalizedCompanyName, linkedInCompanyName);
  let score = Math.round((lcsLength / Math.max(normalizedCompanyName.length, linkedInCompanyName.length)) * 100);

  // Bonus points for main domain
  if (urlParts.hostname === 'www.linkedin.com') {
    score += 20;
  } else if (urlParts.hostname.endsWith('linkedin.com')) {
    score += 10; // Smaller bonus for subdomains
  }

  console.log(`LinkedIn URL: ${url}`);
  console.log(`Company name: ${companyName}, LinkedIn name: ${linkedInCompanyName}`);
  console.log(`LCS length: ${lcsLength}, LCS score: ${score - (urlParts.hostname === 'www.linkedin.com' ? 20 : 10)}`);
  console.log(`Domain bonus: ${urlParts.hostname === 'www.linkedin.com' ? 20 : 10}`);
  console.log(`Total score: ${score}`);

  return score;
}

/**
 * Standardizes LinkedIn URLs to use www.linkedin.com domain,
 * removes any unnecessary parameters or fragments, and truncates
 * to only include the main company path if applicable.
 * 
 * @param url - LinkedIn URL to clean
 * @returns Standardized and truncated LinkedIn URL
 */
function cleanLinkedInUrl(url: string): string {
  const urlObj = new URL(url);
  const pathSegments = urlObj.pathname.split('/').filter(segment => segment.length > 0);

  // Check if the URL is a company URL and has a number after /company/
  if (pathSegments.length >= 3 && pathSegments[0] === 'company' && !isNaN(Number(pathSegments[1]))) {
    return `https://www.linkedin.com/company/${pathSegments[1]}`;
  }

  // Standardize the URL to use www.linkedin.com domain
  return `https://www.linkedin.com${urlObj.pathname}`;
}
