#!/bin/bash

# regress.sh
# Jeff Liu : jeffzyliu
# Jan 18, 2020
# performs regression testing with external test files and writes test results

# usage: ./regress.sh [dirname] [testfilename]



#checking number of inputs
if [ $# -lt 2 ]
then
    echo 1>&2 "usage: ./regress.sh [dirname] [testfilename]..."
    exit 2
fi

#factoring first argument out of $@
dirname="$1"
shift

#checking first argument
if [ -e $dirname ]
then
    if [ ! -d $dirname ]
    then
        echo 1>&2 "first argument $dirname is not a directory"
        exit 3
    fi
fi

#checking other arguments
for arg in "$@"
do
    if [ ! -r $arg ] 
    then
	echo 1>&2 "$arg does not exist or is not readable"
	exit 4
    fi
done

#creating new directory
currdate=$(date +%Y%m%d.%H%M%S)
mkdir $currdate
if [ $? != 0 ]; then exit $?; fi

#running test scripts
for arg in "$@"
do
    strippedname=$(basename $arg)
    cp $arg "$currdate/$strippedname.test"
    bash $arg > "$currdate/$strippedname.stdout" 2> "$currdate/$strippedname.stderr" < /dev/null
    echo $? > "$currdate/$strippedname.status"
done

#rename if needed
if [ ! -e $dirname ]
then
    mv $currdate $dirname
    echo saved test results in $dirname
    exit 0
fi

#otherwise compare
echo saved test results in $currdate
echo comparing $currdate with $dirname...
diff -r --brief $currdate $dirname
if [ $? == 0 ]
then
    echo no differences
    exit 0
fi
exit 1
