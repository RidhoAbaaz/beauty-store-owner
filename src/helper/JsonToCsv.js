export const jsonToCsv = (data) => {
    if(data.length === 0) return "";

    const header = Object.keys(data[0]);

    const rows = data.map(data => 
        header.map(header => {
            const value = data[header] ?? "";
            return `"${String(value).replace(/"/g, '""')}"`;
        }).join(",")
    );

    return [header.join(","), ...rows].join("\n");
}