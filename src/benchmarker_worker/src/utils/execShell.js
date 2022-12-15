const { exec } = require("child_process");
module.exports = {
  command(cmd,params,boolean) {
    return new Promise((resolve, reject) => {
        try{
            console.log(`Command Started: ${cmd}`)
            exec(`${cmd} ${params.join(" ")}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`Command Error: ${cmd}`)
                    console.log(`error: ${error}`);
                    reject(error.message)
                    return;
                } else if (stderr) {
                    console.log(`Command Error: ${cmd}`)
                    console.log(`stderr: ${stderr}`);
                    reject(error)
                    return;
                }else if (boolean){
                    if (stdout.includes("true")) {
                        console.log(`Command Finished OK with true: ${cmd}`)
                        console.log(stdout)
                        resolve(true)
                        return;
                    } else {
                        console.log(`Command Finished OK with false: ${cmd}`)
                        console.log(stdout)
                        resolve(false)
                        return;
                    }
                } else {
                    console.log(`Command Finished OK: ${cmd}`)
                    console.log(`stdout: ${stdout}`);   
                    resolve(stdout)
                    return;
                }
                
            });            
        } catch (e) {
            console.log(`Command exception: ${cmd}`)
            resolve(false)
            return;
        }
    })
  },
};