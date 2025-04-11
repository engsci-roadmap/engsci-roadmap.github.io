import os
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# Full list of course codes
course_codes = [
    "CIV102", "CSC180", "CSC190", "ECE159", "ESC101", "ESC103", "ESC180", "ESC190", "ESC194", "ESC195",
    "MAT185", "MAT194", "MAT195", "MSE160", "PHY180", "AER210", "BME205", "CHE260",
    "ECE253", "ECE259", "ECE286", "MAT292", "PHY293", "PHY294", "STA286"
]

base_url = "https://courses.skule.ca/course/"

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument(f"user-agent={headers['User-Agent']}")
    
    # Use the selenium manager to automatically download and manage the ChromeDriver
    service = Service()
    driver = webdriver.Chrome(options=chrome_options, service=service)
    return driver

def download_pdf(pdf_url, pdf_dir):
    """Helper function to download a PDF file"""
    pdf_name = os.path.basename(pdf_url)
    save_path = os.path.join(pdf_dir, pdf_name)
    
    # Check if file already exists to avoid re-downloading
    if os.path.exists(save_path):
        print(f"[Already exists] {save_path}")
        return True
    
    try:
        r = requests.get(pdf_url, headers=headers, stream=True, timeout=10)
        r.raise_for_status()
        with open(save_path, "wb") as f:
            for chunk in r.iter_content(1024):
                f.write(chunk)
        print(f"[Downloaded] {save_path}")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to download {pdf_url}: {e}")
        return False

def extract_pdfs_from_page(soup, base_url, pdf_dir):
    """Extract and download PDFs from the current page"""
    links = soup.find_all("a", href=True)
    print(f"Found {len(links)} links on the page")
    
    pdf_count = 0
    for link in links:
        href = link["href"]
        if href.endswith(".pdf"):
            pdf_url = urljoin(base_url, href)
            print(f"Found PDF link: {pdf_url}")
            if download_pdf(pdf_url, pdf_dir):
                pdf_count += 1
    
    return pdf_count

def extract_and_download_pdfs(course_code, driver):
    pdf_dir = os.path.join("data", course_code)
    os.makedirs(pdf_dir, exist_ok=True)
    
    total_pdfs = 0
    
    # Only use the tab IDs approach since it's the most effective
    tab_ids = ["61", "62", "63", "64"]  # 61 = Quizzes, 62 = Tests, 63 = Exams, 64 = Assignments
    for tab_id in tab_ids:
        tab_url = f"{base_url}{course_code}H1#{tab_id}"
        print(f"Navigating to tab URL: {tab_url}")
        try:
            driver.get(tab_url)
            time.sleep(2)  # Give JavaScript time to process the hash and load content
            
            soup = BeautifulSoup(driver.page_source, "html.parser")
            pdfs_found = extract_pdfs_from_page(soup, tab_url, pdf_dir)
            total_pdfs += pdfs_found
            print(f"Found {pdfs_found} PDFs on tab #{tab_id}")
        except Exception as e:
            print(f"[ERROR] Failed to process tab URL {tab_url}: {e}")
    
    print(f"Total PDFs found for {course_code}: {total_pdfs}")
    return total_pdfs

if __name__ == "__main__":
    driver = setup_driver()
    try:
        total_all_courses = 0
        for code in course_codes:
            print(f"\n{'='*50}\nProcessing course: {code}\n{'='*50}")
            pdfs = extract_and_download_pdfs(code, driver)
            total_all_courses += pdfs
        print(f"\nTotal PDFs downloaded across all courses: {total_all_courses}")
    finally:
        driver.quit()
