// Seleccionar el elemento de entrada de texto
const input = document.querySelector("input");

// Seleccionar el botón para agregar tarea
const addBtn = document.querySelector(".btn-add");

// Seleccionar la lista de tareas
const ul = document.querySelector("ul");

// Seleccionar el contenedor para el mensaje de lista vacía
const empty = document.querySelector(".empty");

// Seleccionar el texto de tareas pendientes
const tareasPendientesTexto = document.getElementById("tareasPendientesTexto");

// Seleccionar el texto de tareas terminadas
const tareasTerminadasTexto = document.getElementById("tareasTerminadasTexto");

// Seleccionar el contenedor de tareas eliminadas
const deletedTasksContainer = document.querySelector(".deleted-container");

// Seleccionar la lista de tareas eliminadas
const deletedTasksList = document.querySelector(".deleted-tasks");

// Seleccionar el botón para eliminar tareas seleccionadas
const removeSelectedBtn = document.querySelector(".btn-eliminar-seleccionadas");

// Seleccionar el botón para eliminar permanentemente
const permanentDeleteBtn = document.querySelector(".btn-permanent-delete");

// Seleccionar el botón para ver tareas terminadas
const verTareasTerminadasBtn = document.getElementById("verTareasTerminadasBtn");

// Variable para rastrear el estado de la sección de tareas terminadas
let tareasTerminadasVisible = false;

// Variable para rastrear si las tareas eliminadas están ocultas o visibles
let deletedTasksHidden = true;

// Variable para rastrear si hay tareas pendientes después de eliminarlas
let tareasPendientesDespuesEliminar = false;


// Agregar un evento click al botón "Agregar tarea"
addBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Obtener el texto ingresado en la caja de texto y eliminar espacios en blanco al inicio y al final
    const text = input.value.trim();

    // Validar si la caja de texto está vacía
    if (text === "") {
        alert("Revisa que hayas puesto una tarea en el recuadro antes de agregarla.");
        return;
    }

    // Validar si la tarea ya existe en la lista
    if (isTaskDuplicate(text)) {
        alert("La tarea puesta ya existe en la lista.");
        return;
    }

    // Crear elementos de la lista de tareas
    const li = document.createElement("li"); // Crea un elemento de lista
    const p = document.createElement("p"); // Crea un elemento de párrafo
    const checkbox = document.createElement("input"); // Crea un elemento de checkbox
    checkbox.type = "checkbox"; // Establece el tipo de input como checkbox

    // Establecer el texto de la tarea
    p.textContent = text; // Establece el texto del párrafo como el texto ingresado
    
    // Agregar elementos a la lista
    li.appendChild(checkbox); // Agrega el checkbox como hijo del elemento de lista
    li.appendChild(p); // Agrega el párrafo como hijo del elemento de lista
    ul.appendChild(li); // Agrega el elemento de lista a la lista de tareas

    // Limpiar la caja de texto y ocultar el mensaje de lista vacía
    input.value = ""; // Limpia el valor de la caja de texto
    empty.style.display = "none"; // Oculta el mensaje de lista vacía

    // Actualizar estado del botón de eliminar tareas seleccionadas
    updateRemoveSelectedBtnState(); // Llama a la función para actualizar el estado del botón de eliminar tareas seleccionadas

    // Mostrar el texto de tareas pendientes solo si hay tareas en la lista
    if (ul.childElementCount > 0) {
        tareasPendientesTexto.style.display = "block"; // Muestra el texto de tareas pendientes
    }
});

// Agregar un evento click al botón "Eliminar tareas seleccionadas"
removeSelectedBtn.addEventListener("click", () => {
    // Obtener todos los checkboxes seleccionados
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    // Si no hay checkboxes seleccionados, salir de la función
    if (checkboxes.length === 0) {
        return;
    }

    // Mover tareas seleccionadas a la lista de tareas eliminadas
    checkboxes.forEach((checkbox) => {
        const item = checkbox.parentElement; // Obtiene el elemento padre del checkbox
        if (deletedTasksContainer.style.display === "block") {
            deletedTasksList.appendChild(item); // Agrega el elemento a la lista de tareas eliminadas
        } else {
            ul.removeChild(item); // Elimina el elemento de la lista de tareas pendientes
            deletedTasksList.appendChild(item); // Agrega el elemento a la lista de tareas eliminadas
        }
    });

    // Mostrar u ocultar el mensaje de lista vacía
    if (ul.childElementCount === 0) {
        empty.style.display = "block"; // Muestra el mensaje de lista vacía
        // Si no hay tareas pendientes después de eliminarlas, ocultar el texto correspondiente
        tareasPendientesTexto.style.display = "none"; // Oculta el texto de tareas pendientes
        tareasPendientesDespuesEliminar = false; // Actualiza la variable para indicar que no hay tareas pendientes después de eliminarlas
    } else {
        tareasPendientesDespuesEliminar = true; // Actualiza la variable para indicar que hay tareas pendientes después de eliminarlas
    }

    // Actualizar estado del botón de eliminar tareas seleccionadas
    updateRemoveSelectedBtnState(); // Llama a la función para actualizar el estado del botón de eliminar tareas seleccionadas

    // Desmarcar todos los checkboxes
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false; // Desmarca el checkbox
    });

    // Actualizar el estado del botón "Ver Tareas Terminadas"
    updateVerTareasTerminadasBtnState(); // Llama a la función para actualizar el estado del botón "Ver Tareas Terminadas"
});

// Agregar un evento click al botón "Eliminar permanentemente"
permanentDeleteBtn.addEventListener("click", () => {
    // Obtener todos los checkboxes seleccionados en la lista de tareas eliminadas
    const checkboxes = document.querySelectorAll('.deleted-tasks input[type="checkbox"]:checked');

    // Si no hay checkboxes seleccionados, salir de la función
    if (checkboxes.length === 0) {
        return;
    }

    // Eliminar permanentemente tareas seleccionadas de la lista de tareas eliminadas
    checkboxes.forEach((checkbox) => {
        const item = checkbox.parentElement; // Obtiene el elemento padre del checkbox
        deletedTasksList.removeChild(item); // Elimina el elemento de la lista de tareas eliminadas
    });

    // Ocultar el texto de tareas terminadas y la lista de tareas eliminadas si está vacía
    if (deletedTasksList.childElementCount === 0) {
        tareasTerminadasTexto.style.display = "none"; // Oculta el texto de tareas terminadas
        deletedTasksContainer.style.display = "none"; // Oculta el contenedor de tareas eliminadas
    }

    // Actualizar estado del botón de eliminar permanentemente
    updatePermanentDeleteBtnState(); // Llama a la función para actualizar el estado del botón de eliminar permanentemente
});

// Agregar un evento click al botón "Ver Tareas Terminadas"
verTareasTerminadasBtn.addEventListener("click", () => {
    // Si hay tareas terminadas, mostrar la sección correspondiente
    if (deletedTasksList.childElementCount > 0) {
        // Cambiar el estado de visibilidad de las tareas eliminadas
        if (deletedTasksHidden) {
            deletedTasksContainer.style.display = "block"; // Muestra el contenedor de tareas eliminadas
            tareasTerminadasTexto.style.display = "block"; // Muestra el texto de tareas terminadas
            // Si hay tareas pendientes, mostrar el texto correspondiente
            if (ul.childElementCount > 0) {
                tareasPendientesTexto.style.display = "block"; // Muestra el texto de tareas pendientes
            }
            deletedTasksHidden = false; // Actualiza el estado de las tareas eliminadas a visibles
        } else {
            deletedTasksContainer.style.display = "none"; // Oculta el contenedor de tareas eliminadas
            tareasTerminadasTexto.style.display = "none"; // Oculta el texto de tareas terminadas
            deletedTasksHidden = true; // Actualiza el estado de las tareas eliminadas a ocultas
        }
        tareasTerminadasVisible = true; // Actualiza el estado de las tareas terminadas a visibles
    }
});

// Agregar evento change a los checkboxes de la lista de tareas pendientes
ul.addEventListener("change", () => {
    // Actualizar estado del botón de eliminar tareas seleccionadas
    updateRemoveSelectedBtnState(); // Llama a la función para actualizar el estado del botón de eliminar tareas seleccionadas
});

// Agregar evento change a los checkboxes de la lista de tareas eliminadas
deletedTasksList.addEventListener("change", () => {
    // Actualizar estado del botón de eliminar permanentemente
    updatePermanentDeleteBtnState(); // Llama a la función para actualizar el estado del botón de eliminar permanentemente
});

// Función para mostrar u ocultar el botón "Eliminar tareas seleccionadas" según la cantidad de tareas seleccionadas y si hay tareas pendientes
function updateRemoveSelectedBtnState() {
    // Obtener todos los checkboxes seleccionados en la lista de tareas pendientes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    // Mostrar u ocultar el botón según la cantidad de tareas seleccionadas y si hay tareas pendientes
    if (checkboxes.length > 0 && ul.childElementCount > 0) {
        removeSelectedBtn.style.display = "block"; // Muestra el botón de eliminar tareas seleccionadas
    } else {
        removeSelectedBtn.style.display = "none"; // Oculta el botón de eliminar tareas seleccionadas
    }

    // Ocultar el texto de tareas pendientes si no hay tareas pendientes
    if (ul.childElementCount === 0) {
        tareasPendientesTexto.style.display = "none"; // Oculta el texto de tareas pendientes
    }
}

// Función para mostrar u ocultar el botón "Eliminar permanentemente" según la cantidad de tareas seleccionadas
function updatePermanentDeleteBtnState() {
    // Obtener todos los checkboxes seleccionados en la lista de tareas eliminadas
    const checkboxes = document.querySelectorAll('.deleted-tasks input[type="checkbox"]:checked');

    // Mostrar u ocultar el botón según la cantidad de tareas seleccionadas
    if (checkboxes.length > 0 && deletedTasksList.childElementCount > 0 && deletedTasksContainer.style.display === "block") {
        permanentDeleteBtn.style.display = "block"; // Muestra el botón de eliminar permanentemente
    } else {
        permanentDeleteBtn.style.display = "none"; // Oculta el botón de eliminar permanentemente
    }
}

// Función para actualizar el estado del botón "Ver Tareas Terminadas"
function updateVerTareasTerminadasBtnState() {
    // Habilitar o deshabilitar el botón según si hay tareas terminadas
    if (deletedTasksList.childElementCount > 0) {
        verTareasTerminadasBtn.disabled = false; // Habilita el botón "Ver Tareas Terminadas"
    } else {
        verTareasTerminadasBtn.disabled = true; // Deshabilita el botón "Ver Tareas Terminadas"
    }
}

// Función para verificar si una tarea ya existe en la lista
function isTaskDuplicate(text) {
    // Obtener todos los elementos de texto de la lista de tareas pendientes
    const tasks = ul.querySelectorAll("p");

    // Iterar sobre cada elemento de texto y verificar si coincide con el texto proporcionado
    for (const task of tasks) {
        if (task.textContent === text) {
            return true; // Devolver verdadero si la tarea ya existe
        }
    }

    return false; // Devolver falso si la tarea no existe
}
