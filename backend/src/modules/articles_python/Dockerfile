# image alpine (mini linux)
FROM python

# répertoire de travail
WORKDIR /app
EXPOSE 6001

# Copier les dépendances
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt


COPY . .


ENTRYPOINT ["python", "main.py"]