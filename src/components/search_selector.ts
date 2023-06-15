export class SearchSelector<A> {
  searchBoxElem: HTMLInputElement

  searchResults: Set<A>
  searchResultsElem: HTMLFieldSetElement

  selectedItems: Set<A>
  displayElem: HTMLFieldSetElement

  convertToString: (a: A) => string
  editLabel: (a: A, label: HTMLLabelElement) => HTMLLabelElement
  redraw: () => void

  allValues: Set<A>
  presets: Map<string, A[]>

  presetSelectElem: HTMLSelectElement

  
  constructor(
    allValues: Set<A>, 
    searchBoxSelector: string, 
    searchResultsSelector: string, 
    displayElemSelector: string, 
    presets: Map<string, A[]>,
    presetsSelector: string,
    convertToString: ((a: A) => string), 
    editLabel: (a: A, label: HTMLLabelElement) => HTMLLabelElement, 
    redraw: () => void
  ) {
    this.selectedItems = new Set()
    this.searchResults = new Set()
    this.convertToString = convertToString
    this.editLabel = editLabel  
    this.allValues = allValues
    this.presets = presets
    this.redraw = redraw

    const maybeSearchBoxElem = document.querySelector<HTMLInputElement>(searchBoxSelector);
    const maybeSearchResultsElem = document.querySelector<HTMLFieldSetElement>(searchResultsSelector);
    const maybeDisplayElem = document.querySelector<HTMLFieldSetElement>(displayElemSelector);
    const maybePresetSelectElem = document.querySelector<HTMLSelectElement>(presetsSelector);

    if(!maybeSearchResultsElem) {
      throw new Error("Invalid selector provided: " + searchResultsSelector)
    } else {
      this.searchResultsElem = maybeSearchResultsElem!
    }
    
    if(!maybeDisplayElem) {
      throw new Error("Invalid selector provided: " + displayElemSelector)
    } else {
      this.displayElem = maybeDisplayElem!
    }

    if(!maybeSearchBoxElem) {
      throw new Error("Invalid selector provided: " + searchBoxSelector)
    } else {
      this.searchBoxElem = maybeSearchBoxElem!
    }

    if(!maybePresetSelectElem) {
      throw new Error("Invalid selector provided: " + presetsSelector)
    } else {
      this.presetSelectElem = maybePresetSelectElem
    }
  }

  initialize() {
    this.searchBoxElem.onfocus = () => {
      this.searchResultsElem.style.display = "initial";
    }
    this.searchBoxElem.onblur = () => {
      this.searchBoxElem.value = "";
      this.searchResultsElem.style.display = "none";
      this.updateSearchResults()
    }
    
    this.searchBoxElem.oninput = () => {
      this.updateSearchResults();
    }

    this.presets.forEach((_, key) =>
      this.presetSelectElem.add(new Option(key, key))
    )

    this.presetSelectElem.onchange = (_) => {
      this.clearSelection(false)
      const preset = this.presets.get(this.presetSelectElem.value)!
      preset.forEach(a => this.addSelected(a, false))
      this.redraw()
    }

    this.updateSearchResults();
  }

  private updateSearchResults() {
    this.searchResults.clear(); 
    const search = this.searchBoxElem.value.toLowerCase();

    var candidates = Array.from(this.allValues);
    if(search) {
      // filter candidates if search text is present
      candidates = 
        candidates.filter((a) => this.convertToString(a).toLowerCase().includes(search))
    }

    // add all remaining candidates
    candidates.forEach((a) => this.searchResults.add(a))
    
    // remove anything currently displayed
    this.selectedItems.forEach((a) => this.searchResults.delete(a))

    // Clear existing buttons
    while (this.searchResultsElem.firstChild) {
      this.searchResultsElem.removeChild(this.searchResultsElem.firstChild);
    }

    // Add a button for each search result
    this.searchResults.forEach((a) =>  {
      const button = document.createElement("button");
      button.className = "searchResult";
      button.innerText = this.convertToString(a);
      button.onmousedown = (ev) => ev.preventDefault(); // Prevents focus change on click
      button.onclick = () => this.addSelected(a);
      this.searchResultsElem.appendChild(button);
    });
  }

  addSelected(a: A, redraw: boolean = true): void {
    this.addDiv(a);
    this.selectedItems.add(a);
    if(redraw) this.redraw();
    this.updateSearchResults();
  }
  
  removeSelected(a: A, redraw: boolean = true): void {
    this.displayElem.removeChild(document.getElementById(this.convertToString(a))!);
    this.selectedItems.delete(a);
    if(redraw) this.redraw();
    this.updateSearchResults();
  };

  private addDiv(a: A): void {
    const div = document.createElement("div");
    div.id = this.convertToString(a);
    div.className = "labelled-input";
    div.style.display = "flex";
    div.style.alignItems = "center";

    const input = document.createElement("input");
    input.id = `input-${this.convertToString(a)}`;
    input.checked = true;
    input.type = "checkbox";
    input.className = "form-check-input";
    input.onchange = () => {
      this.removeSelected(a)
    };
    div.appendChild(input);

    const label = document.createElement("label");
    label.htmlFor = `input-${this.convertToString(a)}`;
    label.innerText = this.convertToString(a);
    label.style.padding = "0.2em";

    const finalLabel = this.editLabel(a, label)

    div.appendChild(finalLabel);

    this.displayElem.appendChild(div);
  }

  clearSelection(redraw: boolean = true): void {
    this.selectedItems.forEach((a) => this.removeSelected(a, false));
    if(redraw) this.redraw();
    this.updateSearchResults()
  }
  
  selectAll(redraw: boolean = true): void {
    Array.from(this.allValues)
      .filter(a => !this.selectedItems.has(a))
      .forEach(a => this.addSelected(a, false));

    if(redraw) this.redraw();
    this.updateSearchResults()
  }
}
