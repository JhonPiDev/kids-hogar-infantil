CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  teacher_id TEXT,
  capacity INTEGER NOT NULL DEFAULT 0,
  description TEXT
);

CREATE TABLE teachers (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  document_number TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('directora', 'docente')),
  group_names TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE guardians (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  document_number TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  authorized_people TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE children (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  document_number TEXT NOT NULL,
  group_name TEXT NOT NULL,
  photo_url TEXT,
  allergies TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  conditions TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  eps TEXT NOT NULL,
  observations TEXT DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('activo', 'retirado', 'lista de espera')),
  avatar TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  guardian_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE child_guardians (
  child_id TEXT NOT NULL REFERENCES children (id) ON DELETE CASCADE,
  guardian_id TEXT NOT NULL REFERENCES guardians (id) ON DELETE CASCADE,
  PRIMARY KEY (child_id, guardian_id)
);

CREATE TABLE authorizations (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL REFERENCES children (id) ON DELETE CASCADE,
  data_processing BOOLEAN NOT NULL DEFAULT FALSE,
  photo_usage BOOLEAN NOT NULL DEFAULT FALSE,
  authorization_date DATE NOT NULL,
  constancy_by TEXT NOT NULL
);

CREATE INDEX idx_children_group_name ON children(group_name);
CREATE INDEX idx_child_guardians_guardian_id ON child_guardians(guardian_id);
CREATE INDEX idx_authorizations_child_id ON authorizations(child_id);

-- Example: to store a hashed PIN in production.
-- pin_hash should be generated with SHA-256 of the four-symbol PIN.
