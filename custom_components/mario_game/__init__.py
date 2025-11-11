"""Mario Game integration for Home Assistant."""
from __future__ import annotations

import logging
import os
from pathlib import Path
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType
from homeassistant.components.http import StaticPathConfig

_LOGGER = logging.getLogger(__name__)

DOMAIN = "mario_game"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Mario Game component."""
    _LOGGER.info("Mario Game integration loaded")

    # Get the path to the card JS file (in the same directory as this component)
    integration_dir = Path(__file__).parent
    card_path = integration_dir / "mario-game-card.js"

    _LOGGER.info(f"Registering Mario Game card from: {card_path}")

    # Check if file exists
    if not card_path.exists():
        _LOGGER.error(f"Card file not found at: {card_path}")
        return False

    # Register the frontend resources with a unique path
    await hass.http.async_register_static_paths([
        StaticPathConfig(
            "/mario_game/mario-game-card.js",
            str(card_path),
            True,
        )
    ])

    _LOGGER.info("Mario Game card registered at /mario_game/mario-game-card.js")
    _LOGGER.info("Please add this resource in Lovelace:")
    _LOGGER.info("  URL: /mario_game/mario-game-card.js")
    _LOGGER.info("  Type: JavaScript Module")

    return True
