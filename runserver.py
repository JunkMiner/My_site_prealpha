from waitress import serve

import demo0815

serve(demo0815.app, host='0.0.0.0', port=8080)
