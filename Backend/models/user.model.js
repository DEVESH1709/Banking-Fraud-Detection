import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

    // Context-Driven Intelligence fields:
    trustedDevices: {
      type: [String], // e.g., ['MacOS Safari', 'iPhone 14']
      default: [],
    },
    trustedIPs: {
      type: [String], // e.g., ['123.45.67.89']
      default: [],
    },
    locations: {
      type: [
        {
          lat: Number,
          lon: Number,
        },
      ], // e.g., [{ lat: 37.7749, lon: -122.4194 }]
      default: [],
    },
    // Optional: store baseline behavioral metrics
    behavioralProfile: {
      typingSpeed: {
        type: Number, // average ms between keystrokes
        default: null,
      },
      cursorPatternHash: {
        type: String, // hashed representation of cursor movement signature
        default: null,
      },
      typicalLoginHours: {
        type: [Number], // e.g., [9,10,11,14]
        default: [],
      },
    },
    // Optional: historical context logs for audit
    contextLogs: {
      type: [
        {
          ip: String,
          device: String,
          location: {
            lat: Number,
            lon: Number,
          },
          timestamp: Date,
          riskScore: Number,
        },
      ],
      default: [],
    },
    riskScore: {
      type: Number, // cumulative risk score based on context evaluation
    },
  },
  { timestamps: true }
);

export const User = model("User", userSchema);

// import { model, Schema } from "mongoose";

// const userSchema = new Schema(
//   {
//     email: {
//       type: String,
//       unique: true,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     lastLogin: {
//       type: Date,
//       default: Date.now(),
//     },
//     resetPasswordToken: String,
//     resetPasswordExpiresAt: Date,
//     verificationToken: String,
//     verificationTokenExpiresAt: Date,
//   },
//   { timestamps: true }
// );

// export const User = model("User", userSchema);
