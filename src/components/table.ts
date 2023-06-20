import { MetricResult } from "../metrics";

type RowContent = string | MetricResult

export class Table {
    tableElem: HTMLTableElement;

    headers: string[];
    sortMode: { header: string, ascending: boolean} | undefined

    createCell: (header: string, content: RowContent) => HTMLTableCellElement;

    constructor(tableElemId: string, createCell: (header: string, content: RowContent) => HTMLTableCellElement) {
        this.headers = []
        let maybeTableElem = document.querySelector<HTMLTableElement>(tableElemId);
        if (!maybeTableElem) {
            throw new Error("Invalid selector provided: " + tableElemId);
        }
        this.tableElem = maybeTableElem!;
        this.createCell = createCell;
        this.sortMode = undefined;
    }

    setHeaders(headers: string[]) {
        this.headers = [...headers];
    }

    sort(header: string, ascending: boolean) {
        this.sortMode = { header, ascending };
    }

    draw(rows: RowContent[][]) {
        this.tableElem.innerHTML = "";

        const table = document.createElement("table");
        table.className = "table";

        const head = document.createElement("thead");
        const headRow = document.createElement("tr");
        
        let first = false;

        ["", ...this.headers].forEach(header => {
            let headerCol = document.createElement("th");
            let headerDiv = document.createElement("div");
            let headerSpan = document.createElement("span");

            var headerContent = header;

            if(!first) {
                headerCol.className = "rotated-text";
                headerDiv.onclick = () => {
                    if(this.sortMode && this.sortMode.header === header) {
                        this.sort(header, !this.sortMode.ascending);
                    } else {
                        this.sort(header, true);
                    }
                    this.draw(rows);
                }

                if(this.sortMode && this.sortMode.header == header) {
                    if(this.sortMode.ascending) {
                        headerContent = "^ " + headerContent
                    } else {
                        headerContent = "v " + headerContent
                    }
                }
            }

            headerCol.scope = "col";

            headerSpan.innerHTML = headerContent;
            headerSpan.className = "border-bottom";


            headerDiv.appendChild(headerSpan);
            headerCol.appendChild(headerDiv);
            headRow.appendChild(headerCol);

            first = false;
        });
        head.appendChild(headRow);
        table.appendChild(head);
        
        if (this.sortMode) {
            let sortHeader = this.sortMode.header;
            let sortAscending = this.sortMode.ascending;
            let headerIndex = this.headers.indexOf(sortHeader) + 1;
            rows.sort((a, b) => {
                let aVal = a[headerIndex];
                let bVal = b[headerIndex];
                if (typeof aVal === "string" && typeof bVal === "string") {
                    return aVal.localeCompare(bVal) * (sortAscending ? 1 : -1);
                } else {
                    aVal = aVal as MetricResult;
                    bVal = bVal as MetricResult;
                    return (aVal.rawResult - bVal.rawResult) * (sortAscending ? 1 : -1);
                }
            });
        }

        rows.forEach(rowData => {
            let row = document.createElement("tr");

            let firstCell = document.createElement("th");
            firstCell.innerHTML = rowData[0] as string;
            firstCell.scope = "row";
            firstCell.className = "border w-25";
            row.appendChild(firstCell);
                
            var i = 1;
            this.headers.forEach(header => {
                let cell = this.createCell(header, rowData[i]);
                row.appendChild(cell);
                i++;
            });
            table.appendChild(row);
        });
        this.tableElem.appendChild(table);
    }
}