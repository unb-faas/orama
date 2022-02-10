const { exec } = require("child_process");
module.exports = {
  command(cmd,params,boolean) {
    return new Promise((resolve, reject) => {
        exec(`${cmd} ${params.join(" ")}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error}`);
                reject(error.message)
                return;
            } else if (stderr) {
                console.log(`stderr: ${stderr}`);
                reject(error)
                return;
            }else if (boolean){
                if (stdout.includes("true")) {
                    resolve(true)
                    return;
                } else {
                    resolve(false)
                    return;
                }
            } else {
                console.log(`stdout: ${stdout}`);   
                resolve(stdout)
                return;
            }
        });
    })
  },
};