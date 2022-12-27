const { exec } = require("child_process");
module.exports = {
  command(cmd,params,boolean) {
    return new Promise((resolve, reject) => {
        exec(`${cmd} ${params.join(" ")}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`error: ${error.message}`);
                reject(error.message)
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject(stderr)
                return;
            }
            if (boolean){
                if (stdout.includes("true")) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            } else {
                resolve(stdout)
            }
        });
    })
  },
};