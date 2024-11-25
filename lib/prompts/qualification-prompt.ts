export const getQualificationPrompt = (
  companyProfile: {
    companyName: string;
    website: string;
    description: string;
    minimumDealSize: string;
    targetMarkets: string;
    targetJobTitles: string;
    icpDescription: string;
  },
  leadData: {
    jobTitle: string;
    mainInterest?: string;
    notes?: string;
    companyIndustry?: string;
    companySize?: string;
    companyBusiness?: string;
    rawBusinessCard?: string;
    rawTextNote?: string;
    rawVoiceMemo?: string;
  }
) => `
Analyze the lead against company's target criteria. Use ONLY the provided data for comparison.

Company Profile:
- Target Job Titles: ${companyProfile.targetJobTitles}
- Target Markets: ${companyProfile.targetMarkets}
- ICP Description: ${companyProfile.icpDescription}

Lead Information:
- Job Title: ${leadData.jobTitle || 'N/A'}
- Main Interest: ${leadData.mainInterest || 'N/A'}
- Company Industry: ${leadData.companyIndustry || 'N/A'}
- Company Business: ${leadData.companyBusiness || 'N/A'}
- Additional Notes: ${leadData.notes || 'N/A'}

Raw Data Sources:
- Business Card Data: ${leadData.rawBusinessCard || 'N/A'}
- Text Notes: ${leadData.rawTextNote || 'N/A'}
- Voice Memo Transcript: ${leadData.rawVoiceMemo || 'N/A'}

Rules for Qualification:

1. Target Status (isTarget)
   Compare lead's Job Title with Target Job Titles:
   - YES if:
     * Job title exactly matches or is clearly similar to any target position
     * Example: "Senior Facility Manager" matches target "Facility Manager"
   - NO if:
     * Job title is clearly different from all target positions
     * Position is junior version of target role (e.g., "Assistant" or "Junior")
   - UNKNOWN if:
     * Job title is missing or unclear

   Provide targetReason that includes:
   * Exact comparison with target job titles
   * Seniority level assessment if relevant
   * Decision rationale with scoring (0-100)

2. ICP Fit (icpFit)
   Compare these lead fields against ICP Description and Target Markets:
   - Main Interest
   - Company Industry
   - Company Business
   - Additional Notes
   - Raw Data Sources (Business Card, Text Notes, Voice Memo)

   - YES if:
     * Multiple strong matches with ICP description
     * Company characteristics align with target markets
     * Business needs match our solution scope
   - NO if:
     * Clear misalignment with ICP description
     * Company characteristics don't match target markets
     * Business needs outside our solution scope
   - UNKNOWN if:
     * Insufficient information in provided fields
     * Contradictory information
     * Can't make clear determination

   Provide icpReason that includes:
   * Specific matches/mismatches with ICP criteria
   * Market alignment details
   * Business needs assessment
   * Decision rationale with scoring (0-100)

IMPORTANT:
- Consider all raw data sources when evaluating both target status and ICP fit
- Only use provided data fields
- No assumptions about missing information
- Default to UNKNOWN if critical data is missing
- Format reasons as bullet points
- Include scoring in each reason (0-100)
- Keep reasons concise but informative
- Focus on factual comparisons`; 