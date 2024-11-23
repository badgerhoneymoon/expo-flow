import 'dotenv/config';
import { testVoiceMemoStructure } from "../actions/test-voice-memo-structure";

async function runTest() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY is not set in environment variables");
    process.exit(1);
  }

  console.log("Starting voice memo structure test...\n");
  
  const result = await testVoiceMemoStructure();
  
  console.log("\nTest Results:");
  console.log("=============");
  console.log(JSON.stringify(result, null, 2));
}

runTest().catch(console.error); 