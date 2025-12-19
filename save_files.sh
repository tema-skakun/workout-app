#!/bin/bash

# Выходной файл
output_file="all_code.txt"

# Очистка выходного файла, если он существует
> "$output_file"

# Функция для обработки каждого файла
process_file() {
    local file_path="$1"
    # Убираем первые два символа (./) из пути
    local clean_path="${file_path#./}"

    echo "// $clean_path" >> "$output_file"

    sed -E '
#        s/\/\/.*$//;           # Удаляем однострочные комментарии
#        s/\/\*.*\*\/$//;       # Удаляем многострочные комментарии в одной строке
        s/^[[:space:]]*//;     # Удаляем ведущие пробелы
        s/[[:space:]]*$//;     # Удаляем трейлинг пробелы
        /^$/d;                 # Удаляем пустые строки
        s/[[:space:]]+/ /g;    # Заменяем множественные пробелы на один
    ' "$file_path" | tr '\n' ' ' >> "$output_file"  # Заменяем переносы на пробелы вместо удаления

    echo -e "\n\n" >> "$output_file"  # Добавляем разделитель между файлами
}

# Рекурсивный обход всех файлов в текущей директории,
# исключая ненужные директории и файлы
find . -type f \
    -not -path "./.next/*" \
    -not -path "./dist/*" \
    -not -path "./src/components/icons/*" \
    -not -path "./node_modules/*" \
    -not -path "./.DS_Store/*" \
    -not -path "./.git/*" \
    -not -path "./public/*" \
    -not -path "./.idea/*" \
    -not -name ".DS_Store" \
    -not -name "yarn*" \
    -not -name ".gitignore" \
    -not -name "*env.d.ts" \
    -not -name "*.txt" \
    -not -name "*.sh" \
    -not -name "*.ico" \
    -not -name "*.svg" \
    -not -name "*.png" \
    -not -name "*.yml" \
    -not -name "*.md" \
    -not -name "*-lock.json" \
    -not -name "*.tsbuildinfo" \
    -print0 | while IFS= read -r -d '' file; do
    process_file "$file"
done

echo "All code has been collected in $output_file"
