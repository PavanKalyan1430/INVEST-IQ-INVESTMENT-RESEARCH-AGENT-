import { NextRequest } from 'next/server';
import { investIQWorkflow } from '@/graph/workflow';

export const dynamic = 'force-dynamic';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  try {
    const { companyName } = await req.json();

    if (!companyName || typeof companyName !== 'string') {
      return new Response(JSON.stringify({ success: false, message: 'Invalid company name' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        try {
          sendEvent('status', { agent: 'research', status: 'running' });
          sendEvent('thought', 'Searching profile info and web footprints...');
          await sleep(1000);

          const stream = await investIQWorkflow.stream({ companyName });
          let finalReport: any = null;
          let accumulatedState: any = { companyName };

          for await (const chunk of stream) {
            // chunk contains updates from the node that executed
            const nodeName = Object.keys(chunk)[0];
            const nodeOutput = (chunk as any)[nodeName];
            
            // Accumulate state
            accumulatedState = { ...accumulatedState, ...nodeOutput };

            if (nodeName === 'researchAgent') {
              sendEvent('status', { agent: 'research', status: 'completed' });
              sendEvent('discovery', `Profile Retrieved: ${nodeOutput.research?.industry || 'Technology'}`);
              await sleep(1000);

              // Set next parallel agents to running
              sendEvent('status', { agent: 'financial', status: 'running' });
              sendEvent('status', { agent: 'news', status: 'running' });
              sendEvent('status', { agent: 'sentiment', status: 'running' });
              sendEvent('thought', 'Analyzing balance sheet and scanning news...');
            } 
            else if (nodeName === 'financialAgent') {
              sendEvent('status', { agent: 'financial', status: 'completed' });
              sendEvent('discovery', `Financial Score: ${nodeOutput.financial?.score || 80}/100`);
            } 
            else if (nodeName === 'newsAgent') {
              sendEvent('status', { agent: 'news', status: 'completed' });
              sendEvent('discovery', `Collected News: ${nodeOutput.news?.latestNews?.length || 0} Articles`);
            } 
            else if (nodeName === 'sentimentAgent') {
              sendEvent('status', { agent: 'sentiment', status: 'completed' });
              sendEvent('discovery', `Sentiment Label: ${nodeOutput.sentiment?.label || 'Bullish'}`);
            } 
            else if (nodeName === 'riskAgent') {
              sendEvent('status', { agent: 'risk', status: 'running' });
              sendEvent('thought', 'Evaluating operating, legal, and financial risk profiles...');
              await sleep(1000);
              sendEvent('status', { agent: 'risk', status: 'completed' });
              sendEvent('discovery', `Risk Level: ${nodeOutput.risk?.riskLevel || 'Medium'}`);
            } 
            else if (nodeName === 'decisionAgent') {
              sendEvent('status', { agent: 'decision', status: 'running' });
              sendEvent('thought', 'Reconciling bull vs bear perspectives for final decision...');
              await sleep(1200);
              sendEvent('status', { agent: 'decision', status: 'completed' });
              sendEvent('discovery', `Decision: ${nodeOutput.decision?.recommendation || 'INVEST'}`);
            } 
            else if (nodeName === 'reportAgent') {
              sendEvent('status', { agent: 'report', status: 'running' });
              sendEvent('thought', 'Formatting visual datasets and summaries...');
              await sleep(800);
              sendEvent('status', { agent: 'report', status: 'completed' });
              finalReport = nodeOutput.report;
            }
          }

          if (finalReport) {
            sendEvent('state', accumulatedState);
            sendEvent('report', finalReport);
          } else {
            sendEvent('error', 'Report generation failed');
          }
        } catch (err: any) {
          console.error("Workflow streaming error:", err);
          sendEvent('error', err.message || 'An error occurred during workflow execution');
        } finally {
          controller.close();
        }
      }
    });

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error: any) {
    console.error("API route error:", error);
    return new Response(JSON.stringify({ success: false, message: error.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
