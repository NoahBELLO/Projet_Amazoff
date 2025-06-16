cmake_minimum_required(VERSION 3.5)
project(AmazoffMagasinMS)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Autoriser les multiples définitions
set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -Wl,--allow-multiple-definition")

# Chemin d'installation du driver Mongo
set(MONGO_INSTALL "C:/Users/widad/Desktop/Projet_Amazoff/backend/src/modules/magasin_cpp/magasin_cpp/mongo-cxx-driver-r4.0.0/install")
message(STATUS " MONGO_INSTALL = ${MONGO_INSTALL}")

include_directories(
    "${MONGO_INSTALL}/include"
    "${MONGO_INSTALL}/include/bsoncxx/v_noabi"
    "${MONGO_INSTALL}/include/mongocxx/v_noabi"
)

link_directories("${MONGO_INSTALL}/lib")

# ASIO/Crow
set(ASIO_INCLUDE_DIR "C:/Users/widad/Desktop/Projet_Amazoff/backend/src/modules/magasin_cpp/magasin_cpp/third_party/asio/asio/include")
include_directories(${ASIO_INCLUDE_DIR})

set(CROW_INCLUDE_DIR "C:/Users/widad/Desktop/Projet_Amazoff/backend/src/modules/magasin_cpp/magasin_cpp/Crow/include")
include_directories(${CROW_INCLUDE_DIR})

# Tous les .cpp
file(GLOB_RECURSE SOURCES "src/*.cpp")

add_executable(AmazoffMagasinMS ${SOURCES})

# IMPORTANT: Ordre = libs Mongo, puis libs Windows 
# (ou l’inverse si ça échoue : on peut inverser).
target_link_libraries(AmazoffMagasinMS

    # Libs Mongo (C++ + C) en statique
    "${MONGO_INSTALL}/lib/libmongocxx-static.a"
    "${MONGO_INSTALL}/lib/libbsoncxx-static.a"
    "${MONGO_INSTALL}/lib/libmongoc-static-1.0.a"
    "${MONGO_INSTALL}/lib/libbson-static-1.0.a"

    # Libs Windows nécessaires
    ws2_32
    mswsock
    advapi32
    iphlpapi
    dnsapi
    secur32
    crypt32
    bcrypt
)
