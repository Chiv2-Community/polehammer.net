export class Selector<A> {
  searchResults: Set<A>
  searchResultsElem: HTMLFieldSetElement

  display: Set<A>
  displayElem: HTMLFieldSetElement
  
  constructor(searchResultsSelector: string, displayElemSelector: string) {
    this.display = new Set()
    this.searchResults = new Set()

    const maybeSearchResultsElem = document.querySelector<HTMLFieldSetElement>(searchResultsSelector);
    const maybeDisplayElem = document.querySelector<HTMLFieldSetElement>(displayElemSelector);

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
  }




  private addDiv(weapon: Weapon) {
    const div = document.createElement("div");
    div.id = weapon.name;
    div.className = "labelled-input";
    div.style.display = "flex";
    div.style.alignItems = "center";

    const input = document.createElement("input");
    input.id = `input-${weapon.name}`;
    input.checked = true;
    input.type = "checkbox";
    input.className = "form-check-input";
    input.onchange = () => {
      removeWeapon(weapon);
    };
    div.appendChild(input);

    const label = document.createElement("label");
    label.htmlFor = `input-${weapon.name}`;
    label.innerText = weapon.name;
    label.style.padding = "0.2em";
    label.style.border = `3px ${weaponDash(weapon)} ${weaponColor(weapon, 0.6)}`;
    div.appendChild(label);

    displayedWeaponsElem.appendChild(div);
  }
}
