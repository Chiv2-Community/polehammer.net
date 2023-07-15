export class InputHandler {
    private inputElement: HTMLInputElement;
    private outputElement: HTMLElement;

  
    constructor(private inputSelector: string, private outputSelector: string, 
                initialValue: number,
                private convertToString: (input: number) => string, 
                private onChange: (input: number, shouldRedraw: boolean) => void) {
      this.inputElement = document.querySelector<HTMLInputElement>(this.inputSelector)!;
      this.outputElement = document.getElementById(this.outputSelector)!;
      this.inputElement.oninput = () => this.update();

      this.set(initialValue, false);
    }

    public set(value: number, shouldRedraw: boolean = true) {
        this.inputElement.value = value.toString();
        this.update(shouldRedraw);
    }
  
    private update(shouldRedraw: boolean = true) {
      let rawInput = this.inputElement.value;
      let input = Number.parseFloat(rawInput);
      this.outputElement.innerHTML = this.convertToString(input);
      this.onChange(input, shouldRedraw);
    }
  }
  