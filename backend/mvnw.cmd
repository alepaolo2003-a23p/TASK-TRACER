@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM Set local scope
@IF NOT "%MAVEN_SKIP_RC%"=="" GOTO skipRcPre
@SETLOCAL
:skipRcPre

@REM Set MAVEN_HOME
@IF NOT "%MAVEN_HOME%"=="" GOTO setMavenHome
@SET MAVEN_HOME=%USERPROFILE%\.m2
:setMavenHome

@REM Find java.exe
@IF NOT DEFINED JAVA_HOME GOTO findJavaFromJavaHome
@SET JAVA_CMD=%JAVA_HOME%\bin\java.exe
@IF EXIST "%JAVA_CMD%" GOTO chkMHome
:findJavaFromJavaHome
@SET JAVA_CMD=java.exe
@WHERE "%JAVA_CMD%" 2>nul
@IF ERRORLEVEL 1 GOTO errorNoJava
:chkMHome

@SET JAR_PATH=%~dp0.mvn\wrapper\maven-wrapper.jar
@SET MAVEN_OPTS=%MAVEN_OPTS%
@IF NOT "%MAVEN_SKIP_RC%"=="" GOTO skipRc

@REM Execute Maven Wrapper
"%JAVA_CMD%" %MAVEN_OPTS% -jar "%JAR_PATH%" %*

:skipRc
@IF NOT "%MAVEN_SKIP_RC%"=="" GOTO end
@ENDLOCAL
:end
