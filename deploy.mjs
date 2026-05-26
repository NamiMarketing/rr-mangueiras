import FtpDeploy from "ftp-deploy";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ftpDeploy = new FtpDeploy();

const ftpConfig = {
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_HOST,
  port: Number(process.env.FTP_PORT) || 21,
  localRoot: path.join(__dirname, "out"),
  remoteRoot: process.env.FTP_REMOTE_ROOT || "/public_html/",
  include: ["*", "**/*"],
  deleteRemote: false,
  forcePasv: true,
};

console.log(`Enviando arquivos para ${ftpConfig.host}${ftpConfig.remoteRoot}...`);

ftpDeploy.on("uploading", (data) => {
  const pct = Math.round((data.transferredFileCount / data.totalFilesCount) * 100);
  process.stdout.write(`\r[${pct}%] ${data.filename}`);
});

ftpDeploy
  .deploy(ftpConfig)
  .then(() => console.log("\n\nDeploy concluído com sucesso!"))
  .catch((err) => {
    console.error("\nErro no deploy:", err.message);
    process.exit(1);
  });
