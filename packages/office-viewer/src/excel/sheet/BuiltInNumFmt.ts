/**
 * 内置 numfmt，来自 ssf.js，做了修改，主要是将 yy 都改成了 yyyy，不然太容易混淆了
 */
const BuiltInNumFmt: string[] = [];

BuiltInNumFmt[0] = 'General';
BuiltInNumFmt[1] = '0';
BuiltInNumFmt[2] = '0.00';
BuiltInNumFmt[3] = '#,##0';
BuiltInNumFmt[4] = '#,##0.00';
BuiltInNumFmt[9] = '0%';
BuiltInNumFmt[10] = '0.00%';
BuiltInNumFmt[11] = '0.00E+00';
BuiltInNumFmt[12] = '# ?/?';
BuiltInNumFmt[13] = '# ??/??';
// 将原本的 yy 改成 yyyy 了，并换了顺序
BuiltInNumFmt[14] = 'yyyy/m/d';
// 将原本的 yy 改成 yyyy 了，并换了顺序
BuiltInNumFmt[15] = 'yyyy-mmm-d';
BuiltInNumFmt[16] = 'mmm-d';
// 将原本的 yy 改成 yyyy 了，并换了顺序
BuiltInNumFmt[17] = 'yyyy-mmm';
BuiltInNumFmt[18] = 'h:mm AM/PM';
BuiltInNumFmt[19] = 'h:mm:ss AM/PM';
BuiltInNumFmt[20] = 'h:mm';
BuiltInNumFmt[21] = 'h:mm:ss';
// 将原本的 yy 改成 yyyy 了，并换了顺序
BuiltInNumFmt[22] = 'yyyy/m/d h:mm';
BuiltInNumFmt[37] = '#,##0 ;(#,##0)';
BuiltInNumFmt[38] = '#,##0 ;[Red](#,##0)';
BuiltInNumFmt[39] = '#,##0.00;(#,##0.00)';
BuiltInNumFmt[40] = '#,##0.00;[Red](#,##0.00)';
BuiltInNumFmt[45] = 'mm:ss';
BuiltInNumFmt[46] = '[h]:mm:ss';
BuiltInNumFmt[47] = 'mmss.0';
BuiltInNumFmt[48] = '##0.0E+0';
BuiltInNumFmt[49] = '@';
BuiltInNumFmt[56] = '"上午/下午 "hh"時"mm"分"ss"秒 "';

export default BuiltInNumFmt;
