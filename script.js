import { MathfieldElement } from 'https://unpkg.com/mathlive?module';
import { ComputeEngine } from "https://unpkg.com/@cortex-js/compute-engine?module"



// Setting canonical to false will prevent the Compute Engine from simplifying the expression
// Doc : https://cortexjs.io/compute-engine/guides/canonical-form/
const ce = new ComputeEngine();


function addMathField() {
    const mathfield = new MathfieldElement();
    mathfield.classList.add('mathline');
    document.getElementById('math-container').appendChild(mathfield);

    mathVirtualKeyboard.layouts = ["minimalist"];

    // Set the virtual keyboard policy to manual
    window.mathVirtualKeyboardPolicy = "manual";  // Ensure manual control of the keyboard

    // Show the virtual keyboard when the field is focused
    mathfield.addEventListener("focusin", () => {
        window.mathVirtualKeyboard.show();  // Show the keyboard
    });

    // Hide the virtual keyboard when the field loses focus
    mathfield.addEventListener("focusout", () => {
        window.mathVirtualKeyboard.hide();  // Hide the keyboard
    });

    mathfield.focus();

    mathfield.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addMathField();
        } else if (event.key === 'Backspace' && mathfield.getValue() === '') {
            event.preventDefault();
            removeMathField(mathfield);
        }
    });
}

function removeMathField(mathfield) {
    const container = document.getElementById('math-container');
    if (container.children.length > 1) {
        container.removeChild(mathfield);
        const lastField = container.lastElementChild;
        if (lastField) lastField.focus();
    }
}

// Function to display MathJSON content
function displayMathFieldsContent() {
    const container = document.getElementById('math-container');
    const fieldsContent = [];

    container.querySelectorAll('math-field').forEach((mathfield, index) => {
        // Retrieve LaTeX content
        const latex_input = mathfield.getValue('latex');
        // Parse the LaTeX content into MathJSON without simplifying the expression. Doc :
        // https://cortexjs.io/compute-engine/guides/canonical-form/#custom-canonical-form
        const mathJSON = ce.parse(latex_input, { canonical: ["InvisibleOperator"] });
        // Add the MathJSON content to the fieldsContent array
        fieldsContent.push(`Line ${index + 1}: ${JSON.stringify(mathJSON, null, 0)}`);
    });
    // Display the MathJSON in the output span at the bottom of the page
    document.getElementById('output-json').innerHTML = fieldsContent.join('<br><br>');
}

// Expose the displayMathFieldsContent function to the global window scope
window.displayMathFieldsContent = displayMathFieldsContent;


window.addEventListener('DOMContentLoaded', () => {
    // Create a non-editable mathfield with "2(x + 2)"
    const initialMathfield = new MathfieldElement();
    initialMathfield.classList.add('mathline');
    // initialMathfield.setValue('2\\times \\class{ML__highlight}{(3+4)}-1'); // Set the initial value
    initialMathfield.setValue('1\\times 1 + 0'); // Set the initial value
    initialMathfield.readOnly = true; // Make it non-editable
    document.getElementById('math-container').appendChild(initialMathfield);

    // Uncomment to work directly on the Shadow DOM and use a custom style
    //     // Create a new stylesheet
    //     const styleSheet = new CSSStyleSheet();
    //     styleSheet.replaceSync(`
    //      .ML__highlight {
    //          color: red !important;
    //          font-weight: bold !important;
    //      }
    //  `);

    //     // Apply the stylesheet to the shadow DOM
    //     initialMathfield.shadowRoot.adoptedStyleSheets = [styleSheet];


    addMathField(); // Add the first editable math field
});
