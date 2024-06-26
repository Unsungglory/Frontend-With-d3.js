const data = [
    { date: "Sun Mar 31 1968 16:00:00 GMT-0800 (Pacific Daylight Time)", flex: 3.621272, sticky: 4.189963, },
    { date: "Sun Jun 30 1968 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.824843, sticky: 4.565574, },
    { date: "Mon Sep 30 1968 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.523783, sticky: 4.936805, },
    { date: "Tue Dec 31 1968 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 3.560176, sticky: 5.615568, },
    { date: "Mon Mar 31 1969 16:00:00 GMT-0800 (Pacific Daylight Time)", flex: 4.002298, sticky: 5.947254, },
    { date: "Mon Jun 30 1969 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 4.572765, sticky: 6.219216, },
    { date: "Tue Sep 30 1969 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 4.512479, sticky: 6.673968000000001, },
    { date: "Wed Dec 31 1969 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 5.808365, sticky: 6.391178999999999, },
    { date: "Tue Mar 31 1970 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 4.634312, sticky: 7.030776999999999, },
    { date: "Tue Jun 30 1970 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 4.216047, sticky: 7.1639170000000005, },
    { date: "Wed Sep 30 1970 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.914977, sticky: 7.035128, },
    { date: "Thu Dec 31 1970 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 3.2436560000000005, sticky: 7.138244, },
    { date: "Wed Mar 31 1971 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 3.4216370000000005, sticky: 5.495844, },
    { date: "Wed Jun 30 1971 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.669039, sticky: 5.213666, },
    { date: "Thu Sep 30 1971 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.093715, sticky: 4.695696, },
    { date: "Fri Dec 31 1971 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.89777, sticky: 3.7840950000000007, },
    { date: "Fri Mar 31 1972 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 3.173019, sticky: 4.028227, },
    { date: "Fri Jun 30 1972 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.259987, sticky: 3.468296, },
    { date: "Sat Sep 30 1972 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.551842, sticky: 3.1513979999999995, },
    { date: "Sun Dec 31 1972 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 3.8552969999999998, sticky: 3.188526, },
    { date: "Sat Mar 31 1973 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 7.149927, sticky: 3.060648, },
    { date: "Sat Jun 30 1973 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 9.91367, sticky: 3.410221, },
    { date: "Sun Sep 30 1973 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 12.359044, sticky: 4.369578, },
    { date: "Mon Dec 31 1973 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 14.392230999999999, sticky: 5.877921, },
    { date: "Sun Mar 31 1974 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 15.76871, sticky: 7.276441999999999, },
    { date: "Sun Jun 30 1974 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 14.894974999999999, sticky: 8.943358, },
    { date: "Mon Sep 30 1974 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 14.370432999999998, sticky: 10.756425, },
    { date: "Tue Dec 31 1974 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 13.873601000000003, sticky: 11.463072, },
    { date: "Mon Mar 31 1975 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 9.08214, sticky: 11.555634, },
    { date: "Mon Jun 30 1975 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 8.103166, sticky: 10.256056, },
    { date: "Tue Sep 30 1975 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 7.411731, sticky: 8.413767, },
    { date: "Wed Dec 31 1975 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 6.471617999999999, sticky: 7.591388, },
    { date: "Wed Mar 31 1976 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 4.891001, sticky: 7.14888, },
    { date: "Wed Jun 30 1976 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 4.60376, sticky: 6.795168, },
    { date: "Thu Sep 30 1976 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.5284530000000003, sticky: 6.964311, },
    { date: "Fri Dec 31 1976 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 3.1959790000000003, sticky: 6.117029, },
    { date: "Thu Mar 31 1977 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 6.840733, sticky: 6.015151, },
    { date: "Thu Jun 30 1977 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 7.116707, sticky: 6.875746, },
    { date: "Fri Sep 30 1977 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 6.155657, sticky: 6.831618000000001, },
    { date: "Sat Dec 31 1977 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 6.255349000000001, sticky: 7.290647999999999, },
    { date: "Fri Mar 31 1978 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 5.217837, sticky: 7.502142000000001, },
    { date: "Fri Jun 30 1978 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 7.204323, sticky: 7.7551309999999996, },
    { date: "Sat Sep 30 1978 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 8.1559, sticky: 8.65485, },
    { date: "Sun Dec 31 1978 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 8.968781, sticky: 9.14054, },
    { date: "Sat Mar 31 1979 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 11.049245, sticky: 9.785703, },
    { date: "Sat Jun 30 1979 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 12.539386, sticky: 10.345614, },
    { date: "Sun Sep 30 1979 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 14.509971, sticky: 10.934605, },
    { date: "Mon Dec 31 1979 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 14.822162, sticky: 12.567326000000001, },
    { date: "Mon Mar 31 1980 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 16.668806, sticky: 13.928698, },
    { date: "Mon Jun 30 1980 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 13.154172, sticky: 15.171268, },
    { date: "Tue Sep 30 1980 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 12.758694, sticky: 12.777191999999998, },
    { date: "Wed Dec 31 1980 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 12.672534000000002, sticky: 12.38618, },
    { date: "Tue Mar 31 1981 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 11.390453, sticky: 10.271793, },
    { date: "Tue Jun 30 1981 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 10.607543, sticky: 9.211951, },
    { date: "Wed Sep 30 1981 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 9.453761, sticky: 11.878235, },
    { date: "Thu Dec 31 1981 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 7.884585000000001, sticky: 9.596626, },
    { date: "Wed Mar 31 1982 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 3.8620760000000005, sticky: 8.604432, },
    { date: "Wed Jun 30 1982 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 4.93293, sticky: 8.54652, },
    { date: "Thu Sep 30 1982 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.4880500000000003, sticky: 5.899635, },
    { date: "Fri Dec 31 1982 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.934812, sticky: 4.566914, },
    { date: "Thu Mar 31 1983 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.272271, sticky: 4.860478, },
    { date: "Thu Jun 30 1983 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.485868, sticky: 3.004231, },
    { date: "Fri Sep 30 1983 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.09961, sticky: 3.047852, },
    { date: "Sat Dec 31 1983 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 3.017262, sticky: 4.377148, },
    { date: "Sat Mar 31 1984 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 5.179458, sticky: 4.5754, },
    { date: "Sat Jun 30 1984 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.588976, sticky: 4.697065, },
    { date: "Sun Sep 30 1984 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.096118, sticky: 4.987028, },
    { date: "Mon Dec 31 1984 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.757164, sticky: 4.927255, },
    { date: "Sun Mar 31 1985 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.265703, sticky: 4.811491, },
    { date: "Sun Jun 30 1985 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.8228890000000002, sticky: 4.916406, },
    { date: "Mon Sep 30 1985 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 0.973068, sticky: 4.702202, },
    { date: "Tue Dec 31 1985 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.084711, sticky: 4.914869, },
    { date: "Mon Mar 31 1986 16:00:00 GMT-0800 (Pacific Standard Time)", flex: -1.961601, sticky: 5.085772, },
    { date: "Mon Jun 30 1986 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -2.762931, sticky: 4.933547, },
    { date: "Tue Sep 30 1986 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -2.606661, sticky: 4.842261, },
    { date: "Wed Dec 31 1986 16:00:00 GMT-0800 (Pacific Standard Time)", flex: -3.7210019999999995, sticky: 4.560488, },
    { date: "Tue Mar 31 1987 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 1.311324, sticky: 4.22613, },
    { date: "Tue Jun 30 1987 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.684944, sticky: 4.097083, },
    { date: "Wed Sep 30 1987 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 4.919936, sticky: 4.234592, },
    { date: "Thu Dec 31 1987 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 5.138174, sticky: 4.231618, },
    { date: "Thu Mar 31 1988 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.856353, sticky: 4.3735, },
    { date: "Thu Jun 30 1988 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.72738, sticky: 4.612334, },
    { date: "Fri Sep 30 1988 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.34509, sticky: 4.671561, },
    { date: "Sat Dec 31 1988 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 3.680444, sticky: 4.741324, },
    { date: "Fri Mar 31 1989 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 5.338156, sticky: 4.7207, },
    { date: "Fri Jun 30 1989 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 6.2902949999999995, sticky: 4.724807, },
    { date: "Sat Sep 30 1989 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 4.044215, sticky: 4.672486, },
    { date: "Sun Dec 31 1989 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 4.624168, sticky: 4.825075, },
    { date: "Sat Mar 31 1990 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 5.676784, sticky: 5.168488, },
    { date: "Sat Jun 30 1990 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.6989599999999996, sticky: 5.334122, },
    { date: "Sun Sep 30 1990 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 7.500461, sticky: 5.792588, },
    { date: "Mon Dec 31 1990 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 8.268986, sticky: 5.537407, },
    { date: "Sun Mar 31 1991 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 4.130008, sticky: 5.456652, },
    { date: "Sun Jun 30 1991 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 4.717825, sticky: 4.943056, },
    { date: "Mon Sep 30 1991 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.504961, sticky: 4.49761, },
    { date: "Tue Dec 31 1991 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 0.590613, sticky: 4.356866, },
    { date: "Tue Mar 31 1992 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 1.787585, sticky: 3.8513400000000004, },
    { date: "Tue Jun 30 1992 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.825997, sticky: 3.6953890000000005, },
    { date: "Wed Sep 30 1992 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.659875, sticky: 3.1939330000000004, },
    { date: "Thu Dec 31 1992 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.302492, sticky: 3.300442, },
    { date: "Wed Mar 31 1993 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.884628, sticky: 3.1661719999999995, },
    { date: "Wed Jun 30 1993 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.226672, sticky: 3.381306, },
    { date: "Thu Sep 30 1993 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.276114, sticky: 3.443821, },
    { date: "Fri Dec 31 1993 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 1.539334, sticky: 3.366291, },
    { date: "Thu Mar 31 1994 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 1.035073, sticky: 3.3633610000000003, },
    { date: "Thu Jun 30 1994 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.436801, sticky: 3.028228, },
    { date: "Fri Sep 30 1994 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.871124, sticky: 3.079539, },
    { date: "Sat Dec 31 1994 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.475248, sticky: 2.785435, },
    { date: "Fri Mar 31 1995 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.459476, sticky: 3.062253, },
    { date: "Fri Jun 30 1995 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.744853, sticky: 3.214124, },
    { date: "Sat Sep 30 1995 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.146275, sticky: 3.250277, },
    { date: "Sun Dec 31 1995 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 1.075571, sticky: 3.268079, },
    { date: "Sun Mar 31 1996 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.483276, sticky: 3.054601, },
    { date: "Sun Jun 30 1996 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.379021, sticky: 3.00489, },
    { date: "Mon Sep 30 1996 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.065796, sticky: 3.039402, },
    { date: "Tue Dec 31 1996 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 3.986256, sticky: 3.078266, },
    { date: "Mon Mar 31 1997 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.425418, sticky: 2.896853, },
    { date: "Mon Jun 30 1997 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.098897, sticky: 2.835803, },
    { date: "Tue Sep 30 1997 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.444072, sticky: 2.578047, },
    { date: "Wed Dec 31 1997 16:00:00 GMT-0800 (Pacific Standard Time)", flex: -0.24815399999999999, sticky: 2.62023, },
    { date: "Tue Mar 31 1998 16:00:00 GMT-0800 (Pacific Standard Time)", flex: -1.154968, sticky: 2.652318, },
    { date: "Tue Jun 30 1998 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -0.284067, sticky: 2.596712, },
    { date: "Wed Sep 30 1998 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -0.892291, sticky: 2.597862, },
    { date: "Thu Dec 31 1998 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 0.15784, sticky: 2.44488, },
    { date: "Wed Mar 31 1999 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 0.9272640000000001, sticky: 2.282269, },
    { date: "Wed Jun 30 1999 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.038352, sticky: 2.115526, },
    { date: "Thu Sep 30 1999 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 4.220028, sticky: 2.107637, },
    { date: "Fri Dec 31 1999 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 4.049513, sticky: 2.201194, },
    { date: "Fri Mar 31 2000 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 7.001694, sticky: 2.485934, },
    { date: "Fri Jun 30 2000 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 6.408805000000001, sticky: 2.693846, },
    { date: "Sat Sep 30 2000 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 5.158169, sticky: 2.87556, },
    { date: "Sun Dec 31 2000 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 4.989796, sticky: 2.930543, },
    { date: "Sat Mar 31 2001 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 3.388905, sticky: 2.934293, },
    { date: "Sat Jun 30 2001 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.675984, sticky: 3.1834569999999998, },
    { date: "Sun Sep 30 2001 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.519562, sticky: 3.3563550000000006, },
    { date: "Mon Dec 31 2001 16:00:00 GMT-0800 (Pacific Standard Time)", flex: -1.576793, sticky: 3.5136540000000003, },
    { date: "Sun Mar 31 2002 16:00:00 GMT-0800 (Pacific Standard Time)", flex: -2.041254, sticky: 3.4076530000000003, },
    { date: "Sun Jun 30 2002 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -2.608017, sticky: 3.1868509999999994, },
    { date: "Mon Sep 30 2002 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -1.02427, sticky: 2.959539, },
    { date: "Tue Dec 31 2002 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.057981, sticky: 2.750222, },
    { date: "Mon Mar 31 2003 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 4.205019, sticky: 2.581232, },
    { date: "Mon Jun 30 2003 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.530033, sticky: 2.247797, },
    { date: "Tue Sep 30 2003 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.2509230000000002, sticky: 2.16766, },
    { date: "Wed Dec 31 2003 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.613263, sticky: 2.014414, },
    { date: "Wed Mar 31 2004 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 1.278961, sticky: 2.184246, },
    { date: "Wed Jun 30 2004 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 5.166066, sticky: 2.423365, },
    { date: "Thu Sep 30 2004 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.171717, sticky: 2.348976, },
    { date: "Fri Dec 31 2004 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 5.805901, sticky: 2.386403, },
    { date: "Thu Mar 31 2005 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 5.359039, sticky: 2.333154, },
    { date: "Thu Jun 30 2005 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.3666359999999997, sticky: 2.293555, },
    { date: "Fri Sep 30 2005 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 10.947795, sticky: 2.386257, },
    { date: "Sat Dec 31 2005 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 6.423551, sticky: 2.516918, },
    { date: "Fri Mar 31 2006 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 6.734523, sticky: 2.620384, },
    { date: "Fri Jun 30 2006 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 8.376473, sticky: 3.039481, },
    { date: "Sat Sep 30 2006 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 0.983567, sticky: 3.1840439999999997, },
    { date: "Sun Dec 31 2006 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.317298, sticky: 3.114832, },
    { date: "Sat Mar 31 2007 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.011002, sticky: 3.119054, },
    { date: "Sat Jun 30 2007 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.526157, sticky: 2.700975, },
    { date: "Sun Sep 30 2007 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.686897, sticky: 2.645373, },
    { date: "Mon Dec 31 2007 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 7.214764, sticky: 2.840739, },
    { date: "Mon Mar 31 2008 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 6.715425999999999, sticky: 2.827098, },
    { date: "Mon Jun 30 2008 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 9.466224, sticky: 3.072473, },
    { date: "Tue Sep 30 2008 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 9.28955, sticky: 3.216438, },
    { date: "Wed Dec 31 2008 16:00:00 GMT-0800 (Pacific Standard Time)", flex: -3.2677570000000005, sticky: 2.87277, },
    { date: "Tue Mar 31 2009 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -4.02742, sticky: 2.663712, },
    { date: "Tue Jun 30 2009 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -5.146285, sticky: 2.26161, },
    { date: "Wed Sep 30 2009 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -4.554842, sticky: 1.724761, },
    { date: "Thu Dec 31 2009 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 7.102842, sticky: 1.381108, },
    { date: "Wed Mar 31 2010 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 6.695334, sticky: 0.96655, },
    { date: "Wed Jun 30 2010 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.305906, sticky: 0.8254839999999999, },
    { date: "Thu Sep 30 2010 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.544157, sticky: 0.7361, },
    { date: "Fri Dec 31 2010 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 3.4072699999999996, sticky: 0.876379, },
    { date: "Thu Mar 31 2011 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 6.165279, sticky: 1.249889, },
    { date: "Thu Jun 30 2011 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 9.062054, sticky: 1.396905, },
    { date: "Fri Sep 30 2011 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 9.084461, sticky: 1.7973799999999998, },
    { date: "Sat Dec 31 2011 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 5.611772, sticky: 2.113212, },
    { date: "Sat Mar 31 2012 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.686419, sticky: 2.191782, },
    { date: "Sat Jun 30 2012 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 0.246369, sticky: 2.289961, },
    { date: "Sun Sep 30 2012 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.47338, sticky: 2.259779, },
    { date: "Mon Dec 31 2012 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 1.194762, sticky: 2.140146, },
    { date: "Sun Mar 31 2013 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 0.513345, sticky: 2.106284, },
    { date: "Sun Jun 30 2013 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.6804550000000003, sticky: 1.893938, },
    { date: "Mon Sep 30 2013 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -0.543538, sticky: 1.8869769999999997, },
    { date: "Tue Dec 31 2013 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 0.701956, sticky: 1.885255, },
    { date: "Mon Mar 31 2014 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.158743, sticky: 1.84567, },
    { date: "Mon Jun 30 2014 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.9979260000000003, sticky: 2.133907, },
    { date: "Tue Sep 30 2014 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.011281, sticky: 2.001499, },
    { date: "Wed Dec 31 2014 16:00:00 GMT-0800 (Pacific Standard Time)", flex: -2.370153, sticky: 2.041717, },
    { date: "Tue Mar 31 2015 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -4.411111, sticky: 2.062921, },
    { date: "Tue Jun 30 2015 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -3.8823, sticky: 2.168725, },
    { date: "Wed Sep 30 2015 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -4.778135, sticky: 2.30555, },
    { date: "Thu Dec 31 2015 16:00:00 GMT-0800 (Pacific Standard Time)", flex: -3.222202, sticky: 2.426743, },
    { date: "Thu Mar 31 2016 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -2.842673, sticky: 2.524287, },
    { date: "Thu Jun 30 2016 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -2.252511, sticky: 2.556169, },
    { date: "Fri Sep 30 2016 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -0.804854, sticky: 2.599615, },
    { date: "Sat Dec 31 2016 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 1.131565, sticky: 2.55745, },
    { date: "Fri Mar 31 2017 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.53938, sticky: 2.431287, },
    { date: "Fri Jun 30 2017 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 0.537875, sticky: 2.13312, },
    { date: "Sat Sep 30 2017 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.897258, sticky: 2.123039, },
    { date: "Sun Dec 31 2017 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 2.390387, sticky: 2.133619, },
    { date: "Sat Mar 31 2018 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 2.542407, sticky: 2.360827, },
    { date: "Sat Jun 30 2018 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 3.76203, sticky: 2.584619, },
    { date: "Sun Sep 30 2018 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 1.7689550000000003, sticky: 2.47373, },
    { date: "Mon Dec 31 2018 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 0.642411, sticky: 2.454271, },
    { date: "Sun Mar 31 2019 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 0.688296, sticky: 2.426524, },
    { date: "Sun Jun 30 2019 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -0.065987, sticky: 2.503112, },
    { date: "Mon Sep 30 2019 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -0.39766599999999996, sticky: 2.648493, },
    { date: "Tue Dec 31 2019 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 1.219028, sticky: 2.720979, },
    { date: "Tue Mar 31 2020 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -1.205865, sticky: 2.632795, },
    { date: "Tue Jun 30 2020 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: -2.153157, sticky: 2.153414, },
    { date: "Wed Sep 30 2020 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 0.518228, sticky: 2.208419, },
    { date: "Thu Dec 31 2020 16:00:00 GMT-0800 (Pacific Standard Time)", flex: 0.878779, sticky: 1.885168, },
    { date: "Wed Mar 31 2021 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 6.289476, sticky: 1.84629, },
    { date: "Wed Jun 30 2021 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 13.71674, sticky: 2.733652, },
    { date: "Thu Sep 30 2021 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 13.481392, sticky: 2.837582, },
    { date: "Oct 31 2021 17:00:00 GMT-0700 (Pacific Daylight Time)", flex: 17.9, sticky: 3.4 },

]
