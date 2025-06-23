export function evaluateContext(context, userProfile) {
  let riskScore = userProfile.riskScore;

  if (!userProfile.trustedIPs?.includes(context.ip)) {
    riskScore += 1;
    console.log("Risk: IP not trusted:", context.ip);
  }
  if (!userProfile.trustedDevices?.includes(context.device)) {
    riskScore += 1;
    console.log("Risk: Device not trusted:", context.device);
  }

  const loginHour = new Date(context.loginTime).getHours();
  if (loginHour < 6 || loginHour > 22) {
    riskScore += 1;
    console.log("Risk: Login at unusual hour:", loginHour);
  }

  // Fix: Check if context.location and its properties exist before accessing
  let locationMatch = false;
  if (
    context.location &&
    typeof context.location.latitude === "number" &&
    typeof context.location.longitude === "number" &&
    Array.isArray(userProfile.locations)
  ) {
    locationMatch = userProfile.locations.some(
      (loc) =>
        typeof loc.lat === "number" &&
        typeof loc.lon === "number" &&
        Math.abs(loc.lat - context.location.latitude) < 0.5 &&
        Math.abs(loc.lon - context.location.longitude) < 0.5
    );
  }
  if (!locationMatch) {
    riskScore += 1;
    console.log("Risk: Location not matched or missing:", context.location);
  }

  if (typeof context.typingSpeed !== "number" || context.typingSpeed < 300) {
    riskScore += 1;
    console.log("Risk: Typing speed too low or missing:", context.typingSpeed);
  }
  if (
    !Array.isArray(context.cursorMovements) ||
    context.cursorMovements.length < 10
  ) {
    riskScore += 1;
    console.log(
      "Risk: Not enough cursor movements or missing:",
      context.cursorMovements ? context.cursorMovements.length : 0
    );
  }
  if (typeof context.tabSwitches !== "number" || context.tabSwitches > 1) {
    riskScore += 1;
    console.log("Risk: Too many tab switches or missing:", context.tabSwitches);
  }
  if (
    typeof context.screenFPSDrops !== "number" ||
    context.screenFPSDrops > 5
  ) {
    riskScore += 1;
    console.log(
      "Risk: Too many screen FPS drops or missing:",
      context.screenFPSDrops
    );
  }

  return riskScore;
}
