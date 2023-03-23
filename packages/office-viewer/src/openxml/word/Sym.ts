/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/sym.html
 */

export class Sym {
  font: string;
  char: string;

  static parseXML(element: Element): Sym {
    const sym = new Sym();

    sym.font = element.getAttribute('w:font') || '';
    sym.char = element.getAttribute('w:char') || '';

    return sym;
  }
}
