FROM rust:1.88.0
LABEL maintainer="admin@csalab.id"

# Set the shell to bash to ensure proper execution of commands
SHELL ["/bin/bash", "-c"]

# Install Rust components
RUN rustup component add rustfmt && \
    rustup component add clippy && \
    rustup target add wasm32-unknown-unknown

# Install system dependencies and Node.js
RUN apt-get update && \
    apt-get install -y libunwind8 libunwind-dev jq curl && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Set environment variables for NVM
ENV NVM_DIR /root/.nvm
ENV PATH $NVM_DIR/versions/node/v22/bin:$PATH

# Install Node.js and npm
RUN . "$NVM_DIR/nvm.sh" && \
    nvm install 22 && \
    npm install -g npm@11.4.2

# Install DFINITY SDK
RUN wget https://github.com/dfinity/sdk/releases/download/0.28.0/dfx-0.28.0-x86_64-linux.tar.gz && \
    tar -xf dfx-0.28.0-x86_64-linux.tar.gz && \
    mv dfx /usr/local/bin/dfx && \
    rm -rf dfx-0.28.0-x86_64-linux.tar.gz
