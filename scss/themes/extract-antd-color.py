# 用于从 antd 中抽取 color 的脚本，放 components/style 目录下运行

import subprocess

less_vars = []

for line in open('color/colors.less').readlines():
    if line.startswith('@') and line.find(':') != -1:
        var_name = line.split(':')[0]
        less_vars.append(var_name[1:])

tmp_file = open('tmp.less', 'w')

tmp_file.write("@import 'color/colors'; \n")

for var in less_vars:
    tmp_file.write(
        ".{var_name} {{ {var_name}: @{var_name} }} \n".format(var_name=var))

tmp_file.close()

result = subprocess.run(['lessc', '--js', 'tmp.less'], stdout=subprocess.PIPE)


for line in result.stdout.decode('utf-8').split('\n'):
    if line.find(':') != -1:
        print('$' + line.strip())
