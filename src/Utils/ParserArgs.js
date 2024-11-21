/**
 * Función para parsear los parámetros de la línea de comandos.
 * @returns {Object} - Objeto con los parámetros parseados.
 */
function parseCommandLineArgs() {
    const args = process.argv.slice(2);
    const result = {};
  
    args.forEach(arg => {
      const [key, value] = arg.split('=');
      const formattedKey = key.replace(/^--/, '');
      result[formattedKey] = value || true;
    });
  
    return result;
  }
  
  module.exports = parseCommandLineArgs;
  