import semver, { type SemVer } from "semver";

const ENV_FILE = "versions.env";
const CHECK_LATEST_URL =
  "https://api.github.com/repos/caddyserver/caddy/releases/latest";

const getVersionFromEnv = async (): Promise<string> => {
  const pattern = /VERSION\s*=\s*(.+)/;
  const text = await Bun.file(ENV_FILE).text();
  return pattern.exec(text)![1].trim();
};

const setVersionToEnv = async ({
  raw,
  major,
  minor,
  patch,
}: SemVer): Promise<void> => {
  const envText = `VERSION=${raw}\n\nMAJOR=${major}\nMINOR=${minor}\nPATCH=${patch}\n`;
  await Bun.write(ENV_FILE, envText);
};

const setGitHubOutput = async (name: string, value: string) =>
  Bun.$` echo "${name}=${value}" >> $GITHUB_OUTPUT`.quiet();

const getLatestVersion = async (): Promise<string> => {
  const res = await fetch(CHECK_LATEST_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch version: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return (data as { tag_name: string }).tag_name.slice(1);
};

async function main() {
  const [current, found] = await Promise.all([
    getVersionFromEnv(),
    getLatestVersion(),
  ]);

  if (semver.lte(found, current)) {
    console.log(
      `A newer version of Caddy was not found (current: ${current}, found: ${found})`,
    );
    process.exit(1);
  }

  console.warn(
    `A new version of Caddy is available: ${found} (current: ${current})`,
  );

  const latest = semver.parse(found)!;
  await Promise.all([
    setVersionToEnv(latest),
    setGitHubOutput("VERSION", latest.raw),
  ]);
}

main();
