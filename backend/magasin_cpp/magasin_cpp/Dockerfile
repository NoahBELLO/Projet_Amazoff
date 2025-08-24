#Dockerfile pour éviter de tous installer en local
# Étape 1 : builder avec g++, CMake, Mongo driver
FROM ubuntu:22.04 AS builder

EXPOSE 7001

RUN apt-get update && apt-get install -y cmake git libsasl2-dev libsnappy-dev zlib1g-dev libssl-dev libcurl4-openssl-dev \
    libboost-all-dev build-essential pkg-config libasio-dev

# Installation CPR (bibliothèque C++ pour les requetes HTTP)
# RUN git clone https://github.com/libcpr/cpr.git /tmp/cpr && \
#     cd /tmp/cpr && mkdir build && cd build && \
#     cmake .. -DBUILD_SHARED_LIBS=OFF -DCMAKE_USE_OPENSSL=ON && \
#     make && make install

WORKDIR /app

# Copie le projet
COPY . .

# Compilation du driver Mongo C++
WORKDIR /app/mongo-cxx-driver-r4.0.0
RUN git clone -b r4.0.0 https://github.com/mongodb/mongo-cxx-driver.git /app/mongo-cxx-driver-r4.0.0 &&\
    mkdir -p build && cd build && \
    cmake .. \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_INSTALL_PREFIX=../install \
    -DBUILD_VERSION=4.0.0 \
    -DBUILD_SHARED_LIBS=OFF \
    -DCMAKE_POSITION_INDEPENDENT_CODE=ON && \
    cmake --build . && \
    cmake --install .

# Compilation du projet C++
WORKDIR /app
RUN cmake -B build -S . && cmake --build build

# Étape 2 : image légère pour exécution
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    libssl-dev \
    libboost-all-dev \
    libsnappy1v5 \   
    libsasl2-2 \      
    zlib1g \           
    libcurl4 \         
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/build/AmazoffMagasinMS /app/AmazoffMagasinMS
COPY --from=builder /app/README_magsin.md .

CMD ["./AmazoffMagasinMS"]