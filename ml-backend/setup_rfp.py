#!/usr/bin/env python3
"""
Setup script for RFP analysis dependencies
"""

import subprocess
import sys

def install_spacy_model():
    """Install the required spaCy model"""
    try:
        print("Installing spaCy English language model...")
        subprocess.check_call([
            sys.executable, "-m", "spacy", "download", "en_core_web_lg"
        ])
        print("✓ spaCy model installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to install spaCy model: {e}")
        return False
    return True

def main():
    print("Setting up RFP analysis dependencies...")
    
    if install_spacy_model():
        print("\n✓ RFP analysis setup completed successfully!")
        print("You can now use the /rfp/analyze_pdf endpoint.")
    else:
        print("\n✗ Setup failed. Please check the error messages above.")
        sys.exit(1)

if __name__ == "__main__":
    main() 