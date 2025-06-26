cmake_minimum_required(VERSION 3.5)
project(AmazoffMagasinMS)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Autoriser les multiples définitions
set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -Wl,--allow-multiple-definition")

# Répertoire Mongo installé
set(MONGO_INSTALL "${CMAKE_SOURCE_DIR}/mongo-cxx-driver-r4.0.0/install")

# Include dirs (Crow, Asio, Mongo)
include_directories(
    ${CMAKE_SOURCE_DIR}/Crow/include
    ${CMAKE_SOURCE_DIR}/third_party/asio/asio/include
    ${MONGO_INSTALL}/include
    ${MONGO_INSTALL}/include/bsoncxx/v_noabi
    ${MONGO_INSTALL}/include/mongocxx/v_noabi
)

# Lib dirs
link_directories(
    ${MONGO_INSTALL}/lib
)

# Tous les .cpp
file(GLOB_RECURSE SOURCES "src/*.cpp")

add_executable(AmazoffMagasinMS ${SOURCES})

# Liens avec les bibliothèques Mongo + dépendances système
target_link_libraries(AmazoffMagasinMS
    ${MONGO_INSTALL}/lib/libmongocxx-static.a
    ${MONGO_INSTALL}/lib/libbsoncxx-static.a
    ${MONGO_INSTALL}/lib/libmongoc-static-1.0.a
    ${MONGO_INSTALL}/lib/libbson-static-1.0.a
    snappy
    sasl2
    resolv
    ssl
    crypto
    pthread
    z
    dl
)
