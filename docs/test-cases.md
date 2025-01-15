# Test Cases for Lead Processing

## Business Card
```
Michael Smith
NSW Office of Energy and Climate Change
Director of Infrastructure
michael.smith@nsw.gov.au
energy.nsw.gov.au
```

### Expected Output - Business Card
```json
{
  "firstName": "Michael",
  "lastName": "Smith",
  "jobTitle": "Director of Infrastructure",
  "company": "NSW Office of Energy and Climate Change",
  "email": "michael.smith@nsw.gov.au",
  "website": "energy.nsw.gov.au",
  "nextSteps": "Process captured business card",
  "notes": "Business card captured at event",
  "hasBusinessCard": true,
  "hasTextNote": false,
  "hasVoiceMemo": false,
  "rawBusinessCard": "Michael Smith\nNSW Office of Energy and Climate Change\nDirector of Infrastructure\nmichael.smith@nsw.gov.au\nenergy.nsw.gov.au",
  "referrals": []
}
```

## Text Notes Test Case
```
Met Michael Smith from NSW Office of Energy at the Sydney Climate Tech Summit. He's leading infrastructure projects and mentioned they're looking to implement new renewable energy monitoring systems across the state. Interested in our data analytics platform for real-time energy consumption tracking. 

Key points:
- Planning a major infrastructure upgrade in Q1 2024
- Budget already approved for pilot projects
- Wants demo of our dashboard features
- Best to follow up in 2 weeks after their internal review

Referral: Also mentioned his colleague Sarah Johnson, Head of Sustainability, would be good to connect with regarding the environmental impact assessment part of the project. She'll be back from maternity leave in March 2024.
```

### Expected Output - Text Notes
```json
{
  "firstName": "Michael",
  "lastName": "Smith",
  "jobTitle": "Director of Infrastructure",
  "company": "NSW Office of Energy and Climate Change",
  "mainInterest": "Renewable energy monitoring systems and data analytics platform",
  "nextSteps": "Schedule dashboard demo after internal review",
  "notes": "Met at Sydney Climate Tech Summit. Planning major infrastructure upgrade in Q1 2024. Budget approved for pilot projects.",
  "contactTiming": "in 2 weeks",
  "hasBusinessCard": false,
  "hasTextNote": true,
  "hasVoiceMemo": false,
  "rawTextNote": "Met Michael Smith from NSW Office of Energy...",
  "referrals": [
    {
      "firstName": "Sarah",
      "lastName": "Johnson",
      "position": "Head of Sustainability",
      "contactTiming": "after maternity leave",
      "contactDate": "2024-03-01",
      "notes": "Connect regarding environmental impact assessment part of the project"
    }
  ]
}
```

## Voice Memo Test Case
```
Just met Michael Smith, Director of Infrastructure at NSW Office of Energy and Climate Change. They need better monitoring for their renewable energy projects. Their steering committee meets next Thursday - he wants us to follow up Friday afternoon. His colleague Tom Wilson from IT needs to be involved in technical discussions, best reached on Mondays or Wednesdays.
```

### Expected Output - Voice Memo
```json
{
  "firstName": "Michael",
  "lastName": "Smith",
  "jobTitle": "Director of Infrastructure",
  "company": "NSW Office of Energy and Climate Change",
  "mainInterest": "Better monitoring for renewable energy projects",
  "nextSteps": "Follow up after steering committee meeting",
  "notes": "Needs better monitoring solutions for renewable energy projects",
  "contactTiming": "Friday afternoon after next Thursday's steering committee",
  "hasBusinessCard": false,
  "hasTextNote": false,
  "hasVoiceMemo": true,
  "rawVoiceMemo": "Just met Michael Smith, Director of Infrastructure...",
  "referrals": [
    {
      "firstName": "Tom",
      "lastName": "Wilson",
      "position": "IT Department",
      "contactTiming": "Mondays or Wednesdays",
      "notes": "Technical decision maker for infrastructure projects"
    }
  ]
}
```

## Merged Lead Record
After processing all three sources, our system would merge them into a single comprehensive lead record:

```json
{
  "firstName": "Michael",
  "lastName": "Smith",
  "jobTitle": "Director of Infrastructure",
  "company": "NSW Office of Energy and Climate Change",
  "email": "michael.smith@nsw.gov.au",
  "website": "energy.nsw.gov.au",
  "mainInterest": "Renewable energy monitoring systems and data analytics platform",
  "nextSteps": "1. Follow up after steering committee meeting next Friday\n2. Schedule dashboard demo after internal review",
  "notes": "Met at Sydney Climate Tech Summit. Planning major infrastructure upgrade in Q1 2024. Budget approved for pilot projects. Needs better monitoring solutions for renewable energy projects.",
  "contactTiming": "Friday afternoon after next Thursday's steering committee",
  "hasBusinessCard": true,
  "hasTextNote": true,
  "hasVoiceMemo": true,
  "rawBusinessCard": "Michael Smith\nNSW Office of Energy and Climate Change\nDirector of Infrastructure\nmichael.smith@nsw.gov.au\nenergy.nsw.gov.au",
  "rawTextNote": "Met Michael Smith from NSW Office of Energy...",
  "rawVoiceMemo": "Just met Michael Smith, Director of Infrastructure...",
  "referrals": [
    {
      "firstName": "Sarah",
      "lastName": "Johnson",
      "position": "Head of Sustainability",
      "contactTiming": "after maternity leave",
      "contactDate": "2024-03-01",
      "notes": "Connect regarding environmental impact assessment part of the project"
    },
    {
      "firstName": "Tom",
      "lastName": "Wilson",
      "position": "IT Department",
      "contactTiming": "Mondays or Wednesdays",
      "notes": "Technical decision maker for infrastructure projects"
    }
  ],
  "eventName": "Sydney Climate Tech Summit",
  "isTarget": "UNKNOWN",
  "icpFit": "UNKNOWN",
  "qualificationReason": null
}
```

Note how the merged record:
1. Preserves contact info from business card
2. Combines context from all sources
3. Maintains all raw data
4. Merges referrals from different sources
5. Concatenates relevant next steps
6. Preserves source tracking flags
7. Includes qualification fields (initially UNKNOWN) 