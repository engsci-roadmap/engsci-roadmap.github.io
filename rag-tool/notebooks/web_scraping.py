# Import libraries
import requests # Downloading web pages
from bs4 import BeautifulSoup # Parsing HTML
import os # Downloading files, and saving them to a folder
import re # Regular expressions: helps pattern match and string manipulation
from typing import List, Dict # Type annotations for function parameters and return values
from urllib.parse import urljoin, unquote # joining urls and decoding URLs
import logging # Logging for errors and information
import json  # Add json import for debug file writing

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EngSciScraper:
    def __init__(self, base_url: str = "https://courses.skule.ca"):
        self.base_url = base_url
        self.session = requests.Session()
        self.download_base_dir = "data/raw"
        # Add headers to mimic a browser
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': base_url,
            'X-Requested-With': 'XMLHttpRequest'
        })
    
    def create_course_directory(self, course_code: str) -> str:
        """Create directory structure for a course if it doesn't exist."""
        course_dir = os.path.join(self.download_base_dir, course_code) # course_dir = data/raw/course_code
        os.makedirs(course_dir, exist_ok=True) # Create the directory if it doesn't exist
        return course_dir

    def clean_filename(self, filename: str) -> str:
        """Clean filename by removing invalid characters and standardizing format."""
        # Remove invalid filename characters
        filename = re.sub(r'[<>:"/\\|?*]', '', filename)
        # Replace multiple spaces or underscores with single underscore
        filename = re.sub(r'[\s_]+', '_', filename)
        return filename.strip('_')

    def extract_exam_info(self, url: str, link_text: str) -> Dict[str, str]:
        """Extract exam type, year, and term from URL and link text."""
        # Decode URL to handle percent-encoded characters
        decoded_url = unquote(url).lower()
        text = link_text.lower()
        
        # Initialize default values
        info = {
            'year': 'unknown_year',
            'term': '',
            'exam_type': 'exam',
            'is_solution': False
        }
        
        # Clean up the URL by removing numeric IDs
        cleaned_url = re.sub(r'_\d{12}', '', decoded_url)  # Remove long numeric IDs
        cleaned_url = re.sub(r'/bulk/\d{5}/', '/', cleaned_url)  # Remove bulk/YYYYT pattern
        
        # Combine all text sources for better pattern matching
        all_text = f"{cleaned_url} {text}"
        
        # Check if this is a solution file
        if re.search(r'sol|solutions?|answers?|ans', all_text, re.IGNORECASE):
            info['is_solution'] = True
        
        # Try to extract year
        # Look for year in bulk pattern first, then fall back to other patterns
        bulk_year_match = re.search(r'/bulk/(\d{4})\d/', decoded_url)
        if bulk_year_match:
            info['year'] = bulk_year_match.group(1)
        else:
            # Try other year patterns
            year_matches = re.findall(r'(?:20\d{2})|(?:(?<=[\s_])\d{2}(?=[\s_]))', all_text)
            if year_matches:
                # Convert 2-digit years to 4-digit years
                last_year = year_matches[-1]
                if len(last_year) == 2:
                    info['year'] = f"20{last_year}"
                else:
                    info['year'] = last_year
        
        # Extract term (F/S/Y)
        # Look in both the course code and any other part of the text
        term_patterns = [
            r'(?<=[A-Z]\d{3})[FSY](?=_|\d|\.pdf)',  # Term after course number
            r'(?<=H1)[FSY](?=_|\d|\.)',  # Term after H1
            r'(?<=\d{3})[FSY](?![A-Za-z])',  # Term after 3 digits not followed by letters
            r'(?<=20\d{2})[FSY]',  # Term after year
            r'(?<=\d)[FSY](?=\d|_|\.|\s)',  # Term between numbers/underscores
            r'(?<=\d)[FSY](?=_|\s|\.)',  # Term after a number
        ]
        
        for pattern in term_patterns:
            term_match = re.search(pattern, cleaned_url, re.IGNORECASE)
            if term_match:
                info['term'] = term_match.group(0).upper()
                break
        
        # Determine exam type using multiple patterns
        exam_patterns = {
            'final': [
                r'final.*exam(?:ination)?',  # Match both 'exam' and 'examination'
                r'exam(?:ination)?.*final',
                r'_e\.pdf$',  # Common pattern for finals
                r'(?:^|_)f(?:$|\.pdf)',  # Single F marker
                r'final',
                r'(?:^|[_\s])f(?:$|[_\s])',  # F surrounded by spaces or underscores
                r'[_\s]e[_\s\.]'  # E surrounded by spaces, underscores, or dots
            ],
            'midterm2': [  # Check midterm 2 before midterm 1
                r'midterm[_\s-]*2',
                r'mid[_\s-]*term[_\s-]*2',
                r'mt[_\s-]*2',
                r'test[_\s-]*2',
                r'second[_\s-]*midterm',
                r'2nd[_\s-]*midterm'
            ],
            'midterm1': [
                r'midterm[_\s-]*1',
                r'mid[_\s-]*term[_\s-]*1',
                r'mt[_\s-]*1',
                r'test[_\s-]*1',
                r'first[_\s-]*midterm',
                r'1st[_\s-]*midterm'
            ],
            'midterm': [  # Generic midterm if no number specified
                r'midterm',
                r'mid[_\s-]*term',
                r'(?:^|[_\s])mt(?:$|[_\s])',  # MT surrounded by spaces or underscores
                r'(?:^|[_\s])m(?:$|[_\s])'  # Single M surrounded by spaces or underscores
            ],
            'test1': [
                r'test[_\s-]*1',
                r'term[_\s-]*test[_\s-]*1',
                r't1',
                r'test[_\s-]*one',
                r'first[_\s-]*test'
            ],
            'test2': [
                r'test[_\s-]*2',
                r'term[_\s-]*test[_\s-]*2',
                r't2',
                r'test[_\s-]*two',
                r'second[_\s-]*test'
            ]
        }
        
        # Try to match exam type
        for exam_type, patterns in exam_patterns.items():
            for pattern in patterns:
                if re.search(pattern, all_text, re.IGNORECASE):
                    info['exam_type'] = exam_type
                    return info  # Return on first match
        
        # If no specific exam type found, try to extract from common patterns
        if 'test' in all_text:
            info['exam_type'] = 'test'
        elif 'exam' in all_text or 'examination' in all_text:
            info['exam_type'] = 'exam'
            
        return info

    def normalize_course_code(self, course_code: str) -> str:
        """Normalize course code to standard format (e.g., MAT292F -> MAT292H1)."""
        # If it already has H1, return as is
        if 'H1' in course_code:
            return course_code
            
        # Extract the base code and term
        match = re.match(r'([A-Z]{3}\d{3})([FSY])?', course_code)
        if match:
            base, term = match.groups()
            return f"{base}H1" + (f"_{term}" if term else "")
        return course_code

    def download_pdf(self, url: str, save_path: str) -> bool: 
        """Download a PDF file and save it to the specified path."""
        try:
            # Handle both relative and absolute URLs
            if not url.startswith('http'):
                if url.startswith('/api/exam'):
                    url = f"{self.base_url}{url}"
                elif 'exams/' in url or 'exams/bulk/' in url:
                    # Handle cases where the URL might be partial
                    url = f"{self.base_url}/api/exam?file={url}"
                else:
                    url = urljoin(self.base_url, url)
            
            response = self.session.get(url, stream=True)
            response.raise_for_status()
            
            # Check if it's actually a PDF
            content_type = response.headers.get('content-type', '').lower()
            if 'application/pdf' not in content_type and not url.lower().endswith('.pdf'):
                logger.warning(f"URL {url} does not point to a PDF file")
                return False
            
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            logger.info(f"Successfully downloaded: {save_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error downloading {url}: {str(e)}")
            return False

    def login(self, username: str = None, password: str = None):
        """Login to Skule website if credentials are provided."""
        if username and password:
            login_url = f"{self.base_url}/login"
            try:
                # First get the login page to get any CSRF token if needed
                response = self.session.get(login_url)
                response.raise_for_status()
                
                # Extract CSRF token if present
                soup = BeautifulSoup(response.text, 'html.parser')
                csrf_token = soup.find('input', {'name': 'csrf_token'})
                
                # Prepare login data
                login_data = {
                    'username': username,
                    'password': password
                }
                if csrf_token:
                    login_data['csrf_token'] = csrf_token['value']
                
                # Attempt login
                response = self.session.post(login_url, data=login_data)
                response.raise_for_status()
                logger.info("Login successful")
                
            except Exception as e:
                logger.error(f"Login failed: {str(e)}")
                raise

    def scrape_course_page(self, course_code: str) -> None:
        """Scrape all available exams for a given course."""
        # Create course directory using normalized course code
        course_dir = self.create_course_directory(self.normalize_course_code(course_code))
        
        try:
            # First, try to fetch the section data directly from the API
            section_url = f"{self.base_url}/api/course/{self.normalize_course_code(course_code)}/section/63"
            logger.info(f"Fetching exam section data from: {section_url}")
            
            response = self.session.get(section_url)
            response.raise_for_status()
            
            # Log the response status
            logger.info(f"API Response Status: {response.status_code}")
            
            try:
                section_data = response.json()
                logger.debug(f"Section data: {section_data}")
                
                # Extract exam links from the section data
                files = section_data.get('files', [])
                logger.info(f"Found {len(files)} files in section data")
                
                files_downloaded = 0
                for file_info in files:
                    file_url = file_info.get('url')
                    file_name = file_info.get('name', '')
                    
                    if not file_url:
                        continue
                    
                    logger.info(f"Processing file: {file_name} -> {file_url}")
                    
                    # Extract exam information
                    exam_info = self.extract_exam_info(file_url, file_name)
                    logger.debug(f"Extracted exam info: {exam_info}")
                    
                    # Create standardized filename
                    filename_parts = [
                        self.normalize_course_code(course_code),
                        exam_info['year'],
                        exam_info['term'],
                        exam_info['exam_type']
                    ]
                    
                    # Add solution indicator if it's a solution file
                    if exam_info['is_solution']:
                        filename_parts.append('solution')
                    
                    # Filter out empty parts and join with underscores
                    filename = '_'.join(filter(None, filename_parts)) + '.pdf'
                    filename = self.clean_filename(filename)
                    
                    save_path = os.path.join(course_dir, filename)
                    logger.info(f"Attempting to save as: {filename}")
                    
                    # Skip if file already exists
                    if os.path.exists(save_path):
                        logger.info(f"File already exists: {save_path}")
                        continue
                    
                    # Download the PDF
                    if self.download_pdf(file_url, save_path):
                        files_downloaded += 1
                
                logger.info(f"Successfully downloaded {files_downloaded} files for {course_code}")
                
                if files_downloaded == 0:
                    if not files:
                        logger.warning(f"No exam files found for {course_code}. This might be due to:")
                        logger.warning("1. Authentication required")
                        logger.warning("2. No exams available")
                        # Save the API response for debugging
                        debug_file = os.path.join(course_dir, "debug_api_response.json")
                        with open(debug_file, "w", encoding="utf-8") as f:
                            json.dump(section_data, f, indent=2)
                        logger.info(f"Saved debug API response to: {debug_file}")
                    else:
                        logger.warning(f"Found {len(files)} files but failed to download any")
                
            except ValueError as e:
                logger.error(f"Failed to parse JSON response: {str(e)}")
                # Save the raw response for debugging
                debug_file = os.path.join(course_dir, "debug_raw_response.txt")
                with open(debug_file, "w", encoding="utf-8") as f:
                    f.write(response.text)
                logger.info(f"Saved raw response to: {debug_file}")
                raise
                    
        except Exception as e:
            logger.error(f"Error scraping {course_code}: {str(e)}")
            raise

def main():
    # Set up more detailed logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Example usage
    scraper = EngSciScraper()
    
    # Attempt login if credentials are provided
    import os
    username = os.environ.get('SKULE_USERNAME')
    password = os.environ.get('SKULE_PASSWORD')
    if username and password:
        scraper.login(username, password)
    else:
        logger.warning("No credentials provided. Some content might be inaccessible.")
    
    # List of courses to scrape
    courses = [
        # First Year
        "MAT185H1", "MAT195H1", "ESC101H1", "ESC102H1", 
        "ESC103H1", "CIV185H1", "ESC194H1", "ESC195H1",
        "ESC196H1", "ESC197H1", "ESC199H1",
        # Second Year
        "AER201H1", "AER210H1", "BME205H1", "CHE260H1",
        "ECE253H1", "ECE259H1", "ECE286H1", "ESC203H1",
        "MAT292H1", "PHY293H1", "PHY294H1", "STA286H1"
    ]
    
    # Try one course first for testing
    test_course = "MAT185H1"
    logger.info(f"Testing with course: {test_course}")
    scraper.scrape_course_page(test_course)
    
    # Ask user if they want to continue with all courses
    response = input("\nDo you want to continue with all courses? (y/n): ")
    if response.lower() == 'y':
        for course in courses:
            if course != test_course:  # Skip the test course we already did
                logger.info(f"Scraping {course}...")
                scraper.scrape_course_page(course)
    else:
        logger.info("Scraping cancelled by user")

if __name__ == "__main__":
    main()