export async function fetchPowerUsage() {
    try {
        const response = await fetch("http://localhost:3000/api/influx/power-usage");
        if (!response.ok) throw new Error("Fout bij ophalen van data");
        return await response.json();
    } catch (error) {
        console.error("API Fout:", error);
        return [];
    }
}

export async function fetchMeterData() {
    try {
      const response = await fetch("http://localhost:3000/api/influx/meter-data");
      if (!response.ok) {
        throw new Error(`HTTP fout! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Fout bij ophalen van meterdata:", error);
      return null;
    }
  }
  

