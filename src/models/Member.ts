import mongoose, { Document, Schema } from "mongoose";

export interface iMember extends Document {
  id: number;
  full_name: string;
  gender: string;
  created_at: Date;
  role: string;
  home_lc: {
    name: string;
  };
  member_positions: {
    function: {
      name: string;
    };
    start_date: Date;
    end_date: Date;
    office: {
      name: string;
    };
    role: {
      name: string;
    };
    committee_department: {
      name: string;
    };
  }[];
}

const memberSchema: Schema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  full_name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    required: true
  },
  role: {
    type: String,
    required: true // Assuming the role is a required field
  },
  home_lc: {
    name: {
      type: String,
      required: true
    }
  },
  member_positions: [
    {
      function: {
        name: {
          type: String,
          required: true
        }
      },
      start_date: {
        type: Date,
        required: true
      },
      end_date: {
        type: Date,
        required: true
      },
      office: {
        name: {
          type: String,
          required: true
        }
      },
      role: {
        name: {
          type: String,
          required: true
        }
      },
      committee_department: {
        name: {
          type: String
        }
      }
    }
  ]
});

// Define a custom function to insert members without updating existing ones
async function insertMembersIfNotExist(members: iMember[]) {
  const existingIds = await Member.distinct("id", {
    id: { $in: members.map((m) => m.id) }
  });
  const newMembers = members.filter((m) => !existingIds.includes(m.id));

  if (newMembers.length > 0) {
    await Member.insertMany(newMembers);
  }
}

const Member =
  mongoose.models.Member || mongoose.model<iMember>("Member", memberSchema);

export { Member as default, insertMembersIfNotExist };
