#!/usr/bin/env python3
"""
AI Verification Worker
Automatically processes pending verifications and updates results using DFX agent
"""

import asyncio
import os
import json
import time
import subprocess
from datetime import datetime
from typing import List, Dict, Any, Optional

import structlog
from dotenv import load_dotenv

# Load environment
load_dotenv()

# Setup logging
logger = structlog.get_logger()

class AIVerificationWorker:
    """AI Verification Worker that processes pending verifications"""
    
    def __init__(self, canister_id: str = "bkyz2-fmaaa-aaaaa-qaaaq-cai"):
        self.canister_id = canister_id
        self.network = "local"
        self.running = False
        
    async def start(self):
        """Start the worker"""
        logger.info("🚀 Starting AI Verification Worker")
        self.running = True
        
        while self.running:
            try:
                # Check for pending verifications
                pending_count = await self._get_pending_count()
                
                if pending_count > 0:
                    logger.info(f"Found {pending_count} pending verifications")
                    await self._process_pending_verifications()
                else:
                    logger.info("No pending verifications, waiting...")
                    await asyncio.sleep(10)  # Wait 10 seconds before checking again
                    
            except Exception as e:
                logger.error(f"Error in worker loop: {str(e)}")
                await asyncio.sleep(5)  # Wait 5 seconds before retrying
    
    async def _get_pending_count(self) -> int:
        """Get count of pending verifications"""
        try:
            cmd = [
                "dfx", "canister", "call",
                "--network", self.network,
                self.canister_id,
                "get_verification_stats"
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            # Parse result: (total, pending, verified, rejected)
            stats_text = result.stdout.strip()
            logger.info(f"Verification stats: {stats_text}")
            
            # Extract pending count (second number)
            import re
            match = re.search(r'(\d+) : nat64, (\d+) : nat64', stats_text)
            if match:
                pending_count = int(match.group(2))
                return pending_count
            
            return 0
            
        except Exception as e:
            logger.error(f"Error getting pending count: {e}")
            return 0
    
    async def _process_pending_verifications(self):
        """Process all pending verifications"""
        try:
            # Get pending verifications
            cmd = [
                "dfx", "canister", "call",
                "--network", self.network,
                self.canister_id,
                "get_pending_verifications"
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            # For now, we'll process them manually by getting verification IDs
            # In a real implementation, we would parse the Candid output
            logger.info("Processing pending verifications...")
            
            # Parse pending verifications from Candid output
            # For now, we'll manually process known pending verifications
            # In production, we would parse the Candid output properly
            
            # Get current pending count and process if > 0
            pending_count = await self._get_pending_count()
            if pending_count > 0:
                # Process the most recent pending verification
                # This is a simplified approach - in production we'd parse all pending
                await self._process_latest_pending_verification()
            
        except Exception as e:
            logger.error(f"Error processing pending verifications: {e}")
    
    async def _process_latest_pending_verification(self):
        """Process the latest pending verification"""
        try:
            # Get pending verifications and extract the latest one
            cmd = [
                "dfx", "canister", "call",
                "--network", self.network,
                self.canister_id,
                "get_pending_verifications"
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            # Parse the Candid output to extract verification ID
            # This is a simplified approach - in production we'd use a proper Candid parser
            output = result.stdout.strip()
            
            # Look for verification_id pattern in the output
            import re
            verification_id_match = re.search(r'verification_id = "([^"]+)"', output)
            
            if verification_id_match:
                verification_id = verification_id_match.group(1)
                logger.info(f"Found pending verification: {verification_id}")
                await self._process_verification_by_id(verification_id)
            else:
                logger.warning("No verification ID found in pending verifications")
                
        except Exception as e:
            logger.error(f"Error processing latest pending verification: {e}")
    
    async def _process_verification_by_id(self, verification_id: str):
        """Process a specific verification by ID"""
        try:
            logger.info(f"🤖 Processing verification {verification_id}")
            
            # Get verification details
            cmd = [
                "dfx", "canister", "call",
                "--network", self.network,
                self.canister_id,
                "get_verification_result",
                f'("{verification_id}")'
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            if "null" in result.stdout:
                logger.warning(f"Verification {verification_id} not found")
                return
            
            # Simulate AI processing
            await asyncio.sleep(2)  # Simulate processing time
            
            # Generate mock results
            final_score = 88.5 + (hash(verification_id) % 10)  # Random score between 88.5-98.5
            base_similarity = 0.85 + (hash(verification_id) % 10) / 100.0  # Random similarity
            
            # Update verification result
            await self._update_verification_result(
                verification_id,
                "Verified",
                final_score,
                base_similarity,
                0,  # No anomalies
                {
                    "visual_similarity": final_score - 2,
                    "process_consistency": final_score + 1,
                    "authenticity": final_score - 1,
                    "process_quality": final_score + 2
                },
                [],
                [f"Auto-processed verification {verification_id}", "High quality art creation process"]
            )
            
        except Exception as e:
            logger.error(f"Error processing verification {verification_id}: {e}")
    
    async def _update_verification_result(
        self,
        verification_id: str,
        status: str,
        final_score: float,
        base_similarity: float,
        anomaly_count: int,
        breakdown: Dict[str, float],
        evidence_urls: List[str],
        notes: List[str]
    ):
        """Update verification result in canister"""
        try:
            # Convert breakdown to Candid format
            breakdown_list = [(k, v) for k, v in breakdown.items()]
            
            # Convert status to Candid variant
            status_variant = f"variant {{{status}}}"
            
            # Format breakdown for Candid
            breakdown_items = []
            for key, value in breakdown_list:
                breakdown_items.append(f'record {{"{key}"; {value}}}')
            breakdown_candid = f"vec {{{'; '.join(breakdown_items)}}}"
            
            # Format evidence URLs for Candid
            evidence_candid = "vec {}" if not evidence_urls else f"vec {{{'; '.join([f'\"{url}\"' for url in evidence_urls])}}}"
            
            # Format notes for Candid
            notes_candid = "vec {}" if not notes else f"vec {{{'; '.join([f'\"{note}\"' for note in notes])}}}"
            
            # Build dfx command with proper Candid formatting
            cmd = [
                "dfx", "canister", "call",
                "--network", self.network,
                self.canister_id,
                "update_verification_result",
                f'("{verification_id}", {status_variant}, {final_score}, {base_similarity}, {anomaly_count}, {breakdown_candid}, {evidence_candid}, {notes_candid})'
            ]
            
            # Log the command for debugging
            logger.info(f"DFX Command: {' '.join(cmd)}")
            
            logger.info(f"Updating verification {verification_id} with score {final_score}")
            
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            if "Ok" in result.stdout:
                logger.info(f"✅ Successfully updated verification {verification_id}")
            else:
                logger.error(f"❌ Failed to update verification: {result.stdout}")
                
        except Exception as e:
            logger.error(f"Error updating verification result: {e}")

async def main():
    """Main entry point"""
    canister_id = os.getenv("CANISTER_ID_BACKEND", "bkyz2-fmaaa-aaaaa-qaaaq-cai")
    
    logger.info(f"Starting AI Verification Worker")
    logger.info(f"Canister ID: {canister_id}")
    
    worker = AIVerificationWorker(canister_id)
    
    try:
        await worker.start()
    except KeyboardInterrupt:
        logger.info("Worker stopped by user")
    except Exception as e:
        logger.error(f"Worker error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
