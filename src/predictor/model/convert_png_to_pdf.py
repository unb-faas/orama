import os
from PIL import Image

def convert_png_to_pdf(input_dir):
    """
    Converts all PNG files in the given directory to PDF files.
    The generated PDFs are saved in a 'pdf' subdirectory.
    
    :param input_dir: Path to the directory containing PNG files
    """
    output_dir = os.path.join(input_dir, "pdf")
    os.makedirs(output_dir, exist_ok=True)

    for filename in os.listdir(input_dir):
        if filename.lower().endswith(".png"):
            png_path = os.path.join(input_dir, filename)
            pdf_name = os.path.splitext(filename)[0] + ".pdf"
            pdf_path = os.path.join(output_dir, pdf_name)

            with Image.open(png_path) as img:
                # Ensure compatibility with PDF format
                img = img.convert("RGB")
                img.save(pdf_path, "PDF")

            print(f"Converted: {filename} -> {pdf_name}")

if __name__ == "__main__":
    directory = input("Enter the directory containing PNG files: ")
    convert_png_to_pdf(directory)
