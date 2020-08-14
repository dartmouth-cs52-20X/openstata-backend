import time
start_time = time.time()

import pandas as pd
import numpy as np
import scipy.stats

start_time = time.time()

code = """import pandas as pd
import numpy as np
import scipy.stats
print(scipy.stats)
"""

code = "print(scipy.stats)"

print(exec(code), {'__builtins__': None}, {'print': print, 'np': np, 'scipy': scipy, 'pd': pd} )

print("--- %s seconds ---" % (time.time() - start_time))
