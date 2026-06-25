import { StateGraph, START, END } from '@langchain/langgraph';
import { runResearchAgent } from '../agents/researchAgent';
import { runFinancialAgent } from '../agents/financialAgent';
import { runNewsAgent } from '../agents/newsAgent';
import { runSentimentAgent } from '../agents/sentimentAgent';
import { runRiskAgent } from '../agents/riskAgent';
import { runDecisionAgent } from '../agents/decisionAgent';
import { runReportAgent } from '../agents/reportAgent';
import { GraphState } from '../types/graph';

// Reducer function to merge partial states
const updateState = (prev: any, next: any) => ({ ...prev, ...next });

const stateChannels = {
  companyName: { reducer: (prev: string, next: string) => next ?? prev, default: () => '' },
  research: { reducer: updateState, default: () => undefined },
  financial: { reducer: updateState, default: () => undefined },
  news: { reducer: updateState, default: () => undefined },
  sentiment: { reducer: updateState, default: () => undefined },
  risk: { reducer: updateState, default: () => undefined },
  decision: { reducer: updateState, default: () => undefined },
  report: { reducer: updateState, default: () => undefined }
};

const builder = new StateGraph<GraphState>({
  channels: stateChannels
})
  .addNode('researchAgent', runResearchAgent)
  .addNode('financialAgent', runFinancialAgent)
  .addNode('newsAgent', runNewsAgent)
  .addNode('sentimentAgent', runSentimentAgent)
  .addNode('riskAgent', runRiskAgent)
  .addNode('decisionAgent', runDecisionAgent)
  .addNode('reportAgent', runReportAgent)

  .addEdge(START, 'researchAgent')
  
  // Parallel branch execution from Research
  .addEdge('researchAgent', 'financialAgent')
  .addEdge('researchAgent', 'newsAgent')
  .addEdge('researchAgent', 'sentimentAgent')
  
  // Joins at Risk Assessment
  .addEdge('financialAgent', 'riskAgent')
  .addEdge('newsAgent', 'riskAgent')
  .addEdge('sentimentAgent', 'riskAgent')
  
  .addEdge('riskAgent', 'decisionAgent')
  .addEdge('decisionAgent', 'reportAgent')
  .addEdge('reportAgent', END);

export const investIQWorkflow = builder.compile();
