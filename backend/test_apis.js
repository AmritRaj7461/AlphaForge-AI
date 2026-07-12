const { analyze } = require('./src/langchain/argus');

async function test() {
  console.log('--- Testing ARGUS analyze for PAYTM.BO ---');
  try {
    const report = await analyze('PAYTM.BO');
    console.log('\n--- Result Report ---');
    console.log('Success:', report.success);
    console.log('Resolved Name:', report.company?.name);
    console.log('Resolved Symbol:', report.company?.ticker);
    console.log('Financials:', report.financials);
    console.log('DataQuality:', report.dataQuality);
    console.log('LLM Provider used:', report.llmProvider);
  } catch (err) {
    console.error('Analyze failed:', err);
  }
}

test();
