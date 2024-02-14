export const get = {
  getAllUser: `SELECT 
clients.*,
COALESCE(COUNT(jobs.id), 0) as total_jobs,
(
    SELECT createdAt FROM jobs 
    WHERE clients.id = jobs.clients_id 
    ORDER BY createdAt DESC 
    LIMIT 1
) as last_job
FROM 
clients
LEFT JOIN 
jobs ON clients.id = jobs.clients_id
GROUP BY 
clients.id;`,
  getUserById: `SELECT 
  clients.*,
  COALESCE(COUNT(jobs.id), 0) as total_jobs,
  (
      SELECT createdAt FROM jobs 
      WHERE clients.id = jobs.clients_id 
      ORDER BY createdAt DESC 
      LIMIT 1
  ) as last_job
  FROM 
  clients
  LEFT JOIN 
  jobs ON clients.id = jobs.clients_id
  WHERE clients.id = ?
  GROUP BY 
  clients.id`,
  getJobsByUser: `SELECT * FROM jobs WHERE clients_id = ?`
}

export const post = {
  createClient: `INSERT INTO clients (id, createdAt, lastName, nickname, name, phono)
     VALUES (?,?,?,?,?,?)`,
  createJob: `INSERT INTO jobs (id, createdAt, job, observation, clients_id) VALUES (?,?,?,?,?)`
}

export const del = {}

export const join = {}

export const create: { [key: string]: string } = {
  client: `CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT,
  lastName TEXT,
  phono TEXT,
  nickName TEXT,
  createdAt INTEGER,
  updatedAt INTEGER
)
`,
  personal: `CREATE TABLE IF NOT EXIST jobs (
  id TEXT PRIMARY KEY,
  name TEXT,
  lastName TEXT,
  phono TEXT,
  email TEXT,
  createdAt INTEGER,
  updatedAT INTEGER
)`,
  jobs: `CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  job TEXT,
  observation TEXT,
  createdAt INTEGER,
  updatedAt INTEGER,
  clients_id TEXT,
  personal_id TEXT,
  price INTEGER,
  FOREIGN KEY (clients_id) REFERENCES clients(id),
  FOREIGN KEY (personal_id) REFERENCES personal(id)
)`
}
