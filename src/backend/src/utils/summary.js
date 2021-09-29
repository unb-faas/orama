module.exports = {
  generate(results) {
    const sumary = {}
    for (let x in results.raw){
        const repetition = x
        sumary[repetition] = {
            "sum":0.0,
            "count":0,
            "avg":0,
            "concurrences":{}
        }
        for (let y in results.raw[repetition]){
            const concurrence = y
            sumary[repetition]["concurrences"][concurrence] = {
                "sum":0.0,
                "count":0,
                "avg":0.0,
            }
            for (let z in results.raw[repetition][concurrence]){
                const line = z
                const line_data = results.raw[repetition][concurrence][line]
                sumary[repetition]["concurrences"][concurrence]["sum"] += parseFloat(line_data["elapsed"])
                sumary[repetition]["concurrences"][concurrence]["count"] += 1
                sumary[repetition]["sum"] += parseFloat(line_data["elapsed"])
                sumary[repetition]["count"] += 1
            }
        }
    }

    for (let x in results.raw){
        const repetition = x
        for (let y in results.raw[repetition]){
            const concurrence = y
            for (let z in results.raw[repetition][concurrence]){
                sumary[repetition]["concurrences"][concurrence]["avg"] = sumary[repetition]["concurrences"][concurrence]["count"] ? sumary[repetition]["concurrences"][concurrence]["sum"] / sumary[repetition]["concurrences"][concurrence]["count"] : 0 
                sumary[repetition]["avg"] = sumary[repetition]["count"] ? sumary[repetition]["sum"] / sumary[repetition]["count"] : 0
            }
        }
    }
    
    return sumary
  },
};