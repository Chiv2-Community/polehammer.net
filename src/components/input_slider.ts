export class InputHandler {
    private inputElement: HTMLInputElement;
    private outputElement: HTMLElement;
  
    constructor(private inputSelector: string, private outputSelector: string, 
                private convertToString: (input: number) => string, 
                private onChange: (input: number) => void) {
      this.inputElement = document.querySelector<HTMLInputElement>(this.inputSelector)!;
      this.outputElement = document.getElementById(this.outputSelector)!;
      this.inputElement.oninput = () => this.update();
    }

    public set(value: number) {
        this.inputElement.value = value.toString();
        this.update();
    }
  
    private update() {
      let rawInput = this.inputElement.value;
      let input = Number.parseFloat(rawInput);
      this.outputElement.innerHTML = this.convertToString(input);
      this.onChange(input);
    }
  }
  