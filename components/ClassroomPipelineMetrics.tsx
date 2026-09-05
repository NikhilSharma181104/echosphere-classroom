'use client';

export type ClassroomAgentMetric = {
  type: string;
  name: string;
  value: number;
  timestamp: number;
};

export type ClassroomPipelineMetricsProps = {
  metrics: ClassroomAgentMetric[];
};

const PIPELINE = [
  { key: 'stt', label: 'Deepgram STT', metricTypes: ['stt', 'asr'] },
  { key: 'llm', label: 'OpenAI LLM', metricTypes: ['llm', 'mllm'] },
  { key: 'tts', label: 'MiniMax TTS', metricTypes: ['tts'] },
] as const;

function formatMetricName(name: string) {
  return name.replace(/[_-]+/g, ' ');
}

export function ClassroomPipelineMetrics({
  metrics,
}: ClassroomPipelineMetricsProps) {
  const latestByType = new Map<string, ClassroomAgentMetric>();
  for (const metric of metrics) {
    latestByType.set(metric.type.toLowerCase(), metric);
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <span
        className="text-sm font-medium leading-6"
        style={{ color: 'var(--es-text-muted)' }}
      >
        Pipeline
      </span>
      {PIPELINE.map((step, index) => {
        const metric = step.metricTypes
          .map((type) => latestByType.get(type))
          .find(Boolean);

        return (
          <div key={step.key} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-xs" style={{ color: 'var(--es-text-muted)' }} aria-hidden="true">
                /
              </span>
            )}
            <span
              className="rounded-lg px-2 py-0.5 text-xs font-semibold leading-4"
              style={{
                border: '1px solid var(--es-border-subtle)',
                color: 'var(--es-text-primary)',
                background: 'transparent',
              }}
            >
              {step.label}
              {metric && (
                <span
                  className="ml-2"
                  style={{ color: 'var(--es-action-primary)' }}
                  title={new Date(metric.timestamp).toLocaleTimeString()}
                >
                  {formatMetricName(metric.name)} {Math.round(metric.value)}ms
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
