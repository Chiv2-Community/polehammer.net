
type RowContent<A> = string | A

export class Table<A> {
    tableElem: HTMLTableElement;

    headers: string[];
    sortMode: { header: string, ascending: boolean } | undefined

    createCell: (header: string, content: A) => HTMLTableCellElement;
    contentToNumber: (a: A) => number;
    onChange: () => void;

    constructor(tableElemId: string, contentToNumber: (a: A) => number, createCell: (header: string, content: A) => HTMLTableCellElement, onChange: () => void) {
        this.headers = []
        let maybeTableElem = document.querySelector<HTMLTableElement>(tableElemId);
        if (!maybeTableElem) {
            throw new Error("Invalid selector provided: " + tableElemId);
        }
        this.tableElem = maybeTableElem!;
        this.contentToNumber = contentToNumber;
        this.createCell = createCell;
        this.onChange = onChange;
        this.sortMode = undefined;
    }

    setHeaders(headers: string[]) {
        this.headers = [...headers];
    }

    sort(header: string, ascending: boolean) {
        this.sortMode = { header, ascending };
    }

    clearSort() {
        this.sortMode = undefined;
    }

    draw(rows: RowContent<A>[][]) {
        this.tableElem.innerHTML = "";

        const longestHeaderLength = Math.max(...this.headers.map(h => h.length));
        const lastHeaderLength = (this.headers[this.headers.length - 1] || '').length;

        this.tableElem.style.marginTop = `${longestHeaderLength * 0.35}rem`;
        this.tableElem.style.marginRight = `${lastHeaderLength * 0.35}rem`;

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
                    if(this.sortMode?.header === header) {
                        if(this.sortMode.ascending) {
                            // second click
                            this.sort(header, false);
                        } else {
                            // third click
                            this.clearSort();
                        }
                    } else {
                        // first click
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
                    let a = this.contentToNumber(aVal as A);
                    let b = this.contentToNumber(bVal as A);
                    return (a - b) * (sortAscending ? 1 : -1);
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
                let cell = this.createCell(header, rowData[i] as A);
                row.appendChild(cell);
                i++;
            });
            table.appendChild(row);
        });
        this.tableElem.appendChild(table);
        this.onChange();
    }
}