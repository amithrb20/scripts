# Script to Parse the XML test report generated by CasperJS

library("XML")

# setwd("/home/travis/build/att/rcloud/tests/Reports") 
setwd("/home/travis/build/iPrateek032/rcloud/tests/Reports") 
doc<-xmlTreeParse('report.xml')
top<-xmlRoot(doc)
z=names(top)
testcases<-length(z)
package=c()
name=c()
failures=c()
time=c()
for (i in 1:length(z))
{
b<-xmlAttrs(top[[i]])
package=c(package,b['package'])
name=c(name,b['name'])
failures=c(failures, b['failures'])
time=c(time,b['time'])
}
status=c()
df<-data.frame(package, name, time, failures)
status<-function(val){
    if (val == 0 ){
        status=c(status,'Pass')
    }
    else{
        status=c(status,'Fail')
    }
}
#lapply(list(df['failures']), status)

status<-function(val){
    if (val != 0 ){
        return ('Fail')
    }
    else{
        return ('Pass')
    }
}
status<-apply(df['failures'],1,FUN= status)

df<-cbind(df,status)

print(df)

if (dim(df[df$status== "Fail",])[1] != 0){
    print("Build Failed")
    quit(save = "no", status = 10, runLast = TRUE)
}
