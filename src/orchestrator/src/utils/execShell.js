const { exec } = require("child_process");
module.exports = {
  command(cmd,params,boolean) {
    return new Promise((resolve, reject) => {
        exec(`${cmd} ${params.join(" ")}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                reject(error.message)
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                reject(error.message)
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