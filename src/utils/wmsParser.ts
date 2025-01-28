interface TimeRange {
  start: Date;
  end: Date;
  step: string;
}

function parseISODuration(duration: string): number {
  const matches = duration.match(/P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return 0;

  const [, years, months, days, hours, minutes, seconds] = matches;
  
  return (
    (parseInt(years || '0') * 365 * 24 * 60 * 60) +
    (parseInt(months || '0') * 30 * 24 * 60 * 60) +
    (parseInt(days || '0') * 24 * 60 * 60) +
    (parseInt(hours || '0') * 60 * 60) +
    (parseInt(minutes || '0') * 60) +
    parseInt(seconds || '0')
  ) * 1000;
}

function generateTimeRange({ start, end, step }: TimeRange): string[] {
  const times: string[] = [];
  const stepMs = parseISODuration(step);
  let current = start.getTime();
  const endTime = end.getTime();

  while (current <= endTime) {
    times.push(new Date(current).toISOString());
    current += stepMs;
  }

  return times;
}

function filterLastTwoHours(times: string[]): string[] {
  const now = new Date().getTime();
  const twoHoursAgo = now - (2 * 60 * 60 * 1000);
  
  return times.filter(timeStr => {
    const timestamp = new Date(timeStr).getTime();
    return timestamp >= twoHoursAgo && timestamp <= now;
  });
}

export function parseWMSCapabilities(xml: string, layerName: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  
  // Find the specified layer
  const layers = doc.getElementsByTagName('Layer');
  let targetLayer: Element | null = null;
  
  for (let i = 0; i < layers.length; i++) {
    const nameElement = layers[i].getElementsByTagName('Name')[0];
    if (nameElement && nameElement.textContent === layerName) {
      targetLayer = layers[i];
      break;
    }
  }

  if (!targetLayer) {
    console.error(`Layer ${layerName} not found in capabilities`);
    return [];
  }

  // Find the time dimension
  const dimensions = targetLayer.getElementsByTagName('Dimension');
  let timeDimension: Element | null = null;
  
  for (let i = 0; i < dimensions.length; i++) {
    if (dimensions[i].getAttribute('name') === 'time') {
      timeDimension = dimensions[i];
      break;
    }
  }

  if (!timeDimension) {
    console.error('Time dimension not found');
    return [];
  }

  const timeContent = timeDimension.textContent;
  if (!timeContent) return [];

  let times: string[] = [];

  // Handle different time dimension formats
  if (timeContent.includes('/')) {
    // Format: start/end/period
    const [start, end, period] = timeContent.split('/');
    
    const range: TimeRange = {
      start: new Date(start),
      end: new Date(end),
      step: period
    };

    times = generateTimeRange(range);
  } else {
    // Format: comma-separated list of times
    times = timeContent.split(',').map(t => t.trim());
  }

  // Filter for last 2 hours only
  return filterLastTwoHours(times);
}

