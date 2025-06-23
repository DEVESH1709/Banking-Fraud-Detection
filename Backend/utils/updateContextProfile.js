import { User } from "../models/user.model.js";

export const updateContextProfile = async (user, context, riskScore) => {
  const updates = {};

  // Update trusted devices
  if (!user.trustedDevices.includes(context.device)) {
    updates.$addToSet = {
      ...(updates.$addToSet || {}),
      trustedDevices: context.device,
    };
  }

  // Update trusted IPs
  if (!user.trustedIPs.includes(context.ip)) {
    updates.$addToSet = {
      ...(updates.$addToSet || {}),
      trustedIPs: context.ip,
    };
  }

  // Update known locations
  const existingLocation = user.locations?.some(
    (loc) =>
      Math.abs(loc.lat - context.location.latitude) < 0.5 &&
      Math.abs(loc.lon - context.location.longitude) < 0.5
  );
  if (!existingLocation) {
    updates.$push = {
      ...(updates.$push || {}),
      locations: {
        lat: context.location.latitude,
        lon: context.location.longitude,
      },
    };
  }

  // Update behavioral profile (you can average or overwrite)
  updates.behavioralProfile = {
    typingSpeed: context.typingSpeed,
    // future: cursorPatternHash, loginHours, etc.
  };

  // Add this login's context to logs
  updates.$push = {
    ...(updates.$push || {}),
    contextLogs: {
      ip: context.ip,
      device: context.device,
      location: {
        lat: context.location.latitude,
        lon: context.location.longitude,
      },
      timestamp: new Date(),
      riskScore,
    },
  };

  updates.riskScore = riskScore; // Update risk score

  await User.findByIdAndUpdate(user._id, updates, { new: true });
};
