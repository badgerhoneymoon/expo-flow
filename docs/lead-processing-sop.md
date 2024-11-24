# Lead Processing Standard Operating Procedure (MVP)

## Overview
This document outlines the step-by-step process for lead capture, enrichment, and qualification in the ExpoFlow system.

## Data Sources & Icons
- 📸 Business Cards
- 📝 Text Notes
- 🎤 Voice Memos

## Process Flow

### 1. Initial Lead Capture (Business Cards)
- User uploads business card images - should be able to upload multiple
- System extracts data using OCR
- It's structured using GPT-4o-mini
- Creates initial new lead entries
- Shows the table of leads in the UI

### 2. Text Notes Enrichment
- User uploads text notes
- System processes structured data
- Either:
  - Enriches existing lead record (matched by name + company)
  - Creates new lead record
- Adds source icon (📝)

### 3. Voice Memo Enrichment
- User uploads voice memos
- System converts speech to text
- Extracts structured data
- Either:
  - Enriches existing lead record (matched by name + company)
  - Creates new lead record
- Adds source icon (🎤)

### 4. Target Qualification
- System checks job title against company profile target positions
- Marks lead as Target (Yes/No)

### 5. Company Website Enrichment
- For each unique company name:
  - Query API to find company website
  - Update lead records with website info

### 6. ICP Fit Assessment
- GPT analyzes available lead data against company ICP
- Determines ICP fit (Yes/No)
- Updates lead record with assessment

### 7. LinkedIn Enrichment
- For qualified leads (Target = Yes):
  - Query LinkedIn API for profile URL
  - Update lead record with LinkedIn data

### 8. Follow-up Generation
- For leads where:
  - Target = Yes
  - ICP Fit = Yes
- Generate personalized follow-up message template

## Lead Table Structure

### Columns
- First Name
- Last Name
- Job Title
- Company
- Email
- Website
- LinkedIn URL
- Source Icons (📸/📝/🎤)
- Target (Yes/No)
- ICP Fit (Yes/No)
- Follow-up Template

### Status Indicators
- ⏳ Processing
- ✅ Complete
- ❌ Failed

## Error Handling
- Failed enrichments marked for manual review
- Duplicate detection based on name + company
- Data validation at each step

## Performance Metrics
- Processing time per lead
- Enrichment success rate
- Match rate for existing leads 